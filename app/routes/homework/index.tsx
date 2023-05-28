import { getAuth } from "@clerk/remix/ssr.server";
import { Button } from "@mantine/core";
import { Prisma } from "@prisma/client";
import {
  ActionFunction,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { json, useLoaderData } from "~/utils";
import { Form } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { formatDate } from "~/utils/formatDate";
import { logger } from "~/utils/logger";
import { Table } from "~/components/Table";

type HomeworkCompleted = Prisma.HomeworkCompletedGetPayload<{
  include: { homework: true };
}>;

type LoaderData = { homework: Array<HomeworkCompleted> };

export const loader = async (args: LoaderArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/signin");

  logger?.info("Fetching homework completed data for user", {
    userId,
  });

  try {
    const data: LoaderData = {
      homework: await db.homeworkCompleted.findMany({
        where: {
          userId,
        },
        include: {
          homework: true,
        },
      }),
    };

    return json(data);
  } catch (err: any) {
    logger?.error("Unable to load homework completed data for user", {
      userId: userId,
      message: err.message,
    });
  }
};

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args);
  const body = await args.request.formData();
  const homeworkId = Number(body.get("homeworkId") ?? 0);

  if (!userId) return;

  await db.homeworkCompleted.update({
    where: {
      homeworkId_userId: {
        homeworkId,
        userId,
      },
    },
    data: {
      lastCompletionDate: new Date(),
    },
  });

  return null;
};

export const meta: MetaFunction = () => {
  return {
    title: "Homework",
  };
};

export default function HomeworkPage() {
  const data = useLoaderData<LoaderData>();

  const rows = () =>
    data.homework.map((homework) => (
      <tr key={homework.id}>
        <td>{homework.homework.name}</td>
        <td>{formatDate(homework.lastCompletionDate)}</td>
        <td>
          <Form method="post">
            <input
              type={"hidden"}
              name="homeworkId"
              value={homework.homeworkId}
            />
            <Button type="submit">Complete</Button>
          </Form>
        </td>
      </tr>
    ));

  return (
    <>
      <Table
        rowHeaders={["Name", "Last Completed Date", "Log Completion"]}
        title="Homework"
        rowGenerator={rows}
      />
    </>
  );
}
