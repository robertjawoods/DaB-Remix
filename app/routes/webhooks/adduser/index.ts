import type { ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node";
import { Webhook, WebhookVerificationError } from "svix";
import type { UserCreatedPayload } from "~/utils/UserCreatedPayload";

import { db } from "~/utils/db.server";
import { logger } from "~/utils/logger";

const secret = process.env.SVIX_SECRET ?? "";

const initialiseHomework = async (userId: string) => {
  const homework = await db.homework.findMany({
    select: {
      id: true,
    },
  });
  try {
    logger?.info("Creating homework data", {
      userId: userId,
    });
    await db.homeworkCompleted.createMany({
      data: homework.map((hw) => {
        return {
          userId: userId,
          homeworkId: hw.id,
        };
      }),
    });
  } catch {
    logger?.warn("Homework data found for user, skipping", {
      userId: userId,
    });
  }
};

const initialiseLessons = async (userId: string) => {
  const lessons = await db.lesson.findMany({
    select: {
      id: true,
    },
  });

  try {
    logger?.info("Creating lesson data", {
      userId: userId,
    });
    await db.lessonsCompleted.createMany({
      data: lessons.map((l) => {
        return {
          userId: userId,
          lessonId: l.id,
          readText: false,
          watchedVideo: false,
        };
      }),
    });
  } catch {
    logger?.warn("Lesson data found for user, skipping", {
      userId: userId,
    });
  }
};

const initialiseChallenges = async (userId: string) => {
  const challenges = await db.challenge.findMany({
    select: {
      id: true,
    },
  });

  try {
    logger?.info("Creating challenge data", {
      userId: userId,
    });
    await db.challengesCompleted.createMany({
      data: challenges.map((c) => {
        return {
          userId: userId,
          challengeId: c.id,
        };
      }),
    });
  } catch {
    logger?.warn("Challenge data found for user, skipping", {
      userId: userId,
    });
  }
};

const initialiseUserData = async (userId: string, email: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    await db.user.create({
      data: {
        email: email,
        id: userId,
      },
    });
  } else {
    logger?.warn("User exists, skipping", {
      userId: userId,
    });
  }

  await initialiseHomework(userId);
  await initialiseChallenges(userId);
  await initialiseLessons(userId);
};

async function tryCreateUser(request: Request) {
  const svixHeaders = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  const wh = new Webhook(secret);
  const payload = wh.verify(
    await request.text(),
    svixHeaders
  ) as UserCreatedPayload;

  await initialiseUserData(
    payload.data.id,
    payload.data.email_addresses[0].email_address
  );
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  try {
    await tryCreateUser(request);

    return json({}, 200);
  } catch (err: any) {
    if (err instanceof WebhookVerificationError)
      return json({ message: "Unauthorised" }, 401);

    return json({ message: err.message }, 500);
  }
};
