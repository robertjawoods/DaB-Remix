import { getAuth } from "@clerk/remix/ssr.server";
import { Title, Text, Box, Container, Grid } from "@mantine/core";
import type {
  ChallengesCompleted,
  HomeworkCompleted,
  LessonsCompleted,
} from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { da } from "date-fns/locale";
import { Doughnut } from "react-chartjs-2";
import { db } from "~/utils/db.server";
import { formatTimeValue } from "~/utils/formatDate";

ChartJS.register(ArcElement, Legend, Tooltip);
type LoaderData = {
  homeworkCompleted: Array<HomeworkCompleted>;
  challengesCompleted: Array<ChallengesCompleted>;
  lessonsCompleted: Array<LessonsCompleted>;
  timeSpent: {
    h: number,
    m: number, 
    s: number
  };
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) return redirect("/signin");

  const fiftyTime = await db.fiftyTime.findMany({
    where: {
      userId: userId ?? "",
    },
  });

  const timeSpent = toHoursAndMinutes(fiftyTime
    .map((time) => {
      return Math.abs(
        (time.startDate.getTime() - time.endDate.getTime()) / 1000
      );
    })
    .reduce((prev, curr) => prev + curr, 0));

  const data: LoaderData = {
    homeworkCompleted: await db.homeworkCompleted.findMany({
      where: {
        userId: userId ?? "",
      },
    }),
    challengesCompleted: await db.challengesCompleted.findMany({
      where: {
        userId: userId ?? "",
      },
    }),
    lessonsCompleted: await db.lessonsCompleted.findMany({
      where: {
        userId: userId ?? "",
      },
    }),
    timeSpent
  };

  return json(data);
};

function toHoursAndMinutes(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = Math.floor(totalSeconds % 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return { h: hours, m: minutes, s: seconds };
}

export default function Dashboard() {
  const data = useLoaderData<LoaderData>();

  const timeSpent = data.timeSpent;

  const homeworkCompletedStats = () => {
    const hwCompletedCount = data.homeworkCompleted.filter(
      (hw) => hw.lastCompletionDate
    ).length;

    const chartData = {
      labels: ["Complete", "Incomplete"],
      datasets: [
        {
          label: "# of Votes",
          data: [hwCompletedCount, data.homeworkCompleted.length],
          backgroundColor: ["rgba(0, 255, 0, 0.2)", "rgba(255, 0, 0, 0.2)"],
          borderColor: ["rgba(0, 255, 0, 0.2)", "rgba(255, 0, 0, 0.2)"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Box
        style={{
          width: "25rem",
          height: "auto",
        }}
      >
        <Title order={2}>Homework Completed</Title>
        <Doughnut data={chartData} />
      </Box>
    );
  };

  const challengesCompletedStats = () => {
    const challengesCompletedCount = data.challengesCompleted.filter(
      (c) => c.completedCount > 0
    ).length;

    const chartData = {
      labels: ["Complete", "Incomplete"],
      datasets: [
        {
          label: "# of Votes",
          data: [challengesCompletedCount, data.challengesCompleted.length],
          backgroundColor: ["rgba(0, 255, 0, 0.2)", "rgba(255, 0, 0, 0.2)"],
          borderColor: ["rgba(0, 255, 0, 0.2)", "rgba(255, 0, 0, 0.2)"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Box>
        <Box
          style={{
            width: "25rem",
            height: "auto",
          }}
        >
          <Title order={2}>Challenges Completed</Title>
          <Doughnut data={chartData} />
        </Box>
        <Text>
          Total Challenges Completed:{" "}
          {data.challengesCompleted.reduce((acc, i) => {
            return acc + i.completedCount;
          }, 0)}
        </Text>
      </Box>
    );
  };

  const lessonsCompletedStats = () => {
    const lessonsCompletedCount = data.lessonsCompleted.filter(
      (l) => l.completionDate
    ).length;

    const chartData = {
      labels: ["Complete", "Incomplete"],
      datasets: [
        {
          label: "# of Votes",
          data: [lessonsCompletedCount, data.lessonsCompleted.length],
          backgroundColor: ["rgba(0, 255, 0, 0.2)", "rgba(255, 0, 0, 0.2)"],
          borderColor: ["rgba(0, 255, 0, 0.2)", "rgba(255, 0, 0, 0.2)"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Box>
        <Box
          style={{
            width: "25rem",
            height: "auto",
          }}
        >
          <Title order={2}>Lessons Completed</Title>
          <Doughnut data={chartData} />
        </Box>
        <Text>
          Lessons completed: {lessonsCompletedCount}/
          {data.lessonsCompleted.length}
        </Text>
      </Box>
    );
  };

  return (
    <Box>
      <Title order={1}>Dashboard</Title>

      <Grid>
        {homeworkCompletedStats()}
        {challengesCompletedStats()}
        {lessonsCompletedStats()}
        <Text>Time Spent: {formatTimeValue(timeSpent.h)}:{formatTimeValue(timeSpent.m)}:{formatTimeValue(timeSpent.s)}</Text>
      </Grid>
    </Box>
  );
}
