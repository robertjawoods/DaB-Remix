import { getAuth } from "@clerk/remix/ssr.server";
import { Prisma } from "@prisma/client";
import {
  ActionFunction,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { logger } from "~/utils/logger";
import { db } from "~/utils/db.server";
import { LessonRow } from "~/components/LessonRow";
import { json, useLoaderData } from "~/utils";
import { Table } from "~/components/Table";

export type LessonsCompleted = Prisma.LessonsCompletedGetPayload<{
  include: { lesson: true };
}>;

type LoaderData = { lessons: Array<LessonsCompleted> };

export const loader = async (args: LoaderArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/signin");

  const data: LoaderData = {
    lessons: await db.lessonsCompleted.findMany({
      where: {
        userId: userId ?? "",
      },
      include: {
        lesson: {
          select: {
            index: true,
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        lessonId: "asc",
      },
    }),
  };

  return json(data);
};

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args);
  const formData = await args.request.formData();

  console.log(formData.entries());

  const watchedVideo = formData.get("watchedVideo");
  const readText = formData.get("readText");
  const lessonId = Number(formData.get("lessonId"));

  const watchedVideoBool = watchedVideo === "true" || watchedVideo === "on";
  const readTextBool = readText === "true" || readText === "on";

  logger?.info("Updating lesson completed for user", {
    userId: userId,
    readText: readText === "true" || readText === "on",
    watchedVideo: watchedVideo === "true" || watchedVideo === "on",
    lessonId: lessonId,
  });

  if (!userId) return;

  const result = await db.lessonsCompleted.update({
    where: {
      lessonId_userId: {
        lessonId,
        userId,
      },
    },
    data: {
      watchedVideo: watchedVideoBool,
      readText: readTextBool,
      completionDate: watchedVideoBool && readTextBool ? new Date() : null,
    },
  });

  return json({ newValue: result }, 200);
};

export const meta: MetaFunction = () => {
  return {
    title: "Lessons",
  };
};

export default function Lessons() {
  const data = useLoaderData<LoaderData>();

  const rows = () => data.lessons.map((lesson) => {
    return <LessonRow lesson={lesson} key={lesson.lessonId} />;
  });

  return (
    <>
      <Table
        title="Lessons"
        rowHeaders={[
          "Name",
          "Read Text?",
          "Watched Video?",
          "Completion Date",
        ]}
        rowGenerator={rows}
      />
    </>
  );
}
