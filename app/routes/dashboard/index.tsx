import { getAuth } from "@clerk/remix/ssr.server"
import { Title, Text, Box } from "@mantine/core"
import type { ChallengesCompleted, HomeworkCompleted, LessonsCompleted } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"

type LoaderData = {
    homeworkCompleted: Array<HomeworkCompleted>,
    challengesCompleted: Array<ChallengesCompleted>,
    lessonsCompleted: Array<LessonsCompleted>
}

export const loader: LoaderFunction = async ({ request }) => {
    const { userId } = await getAuth(request);

    const data: LoaderData = {
        homeworkCompleted: await db.homeworkCompleted.findMany({
            where: {
                userId: userId ?? ""
            }
        }),
        challengesCompleted: await db.challengesCompleted.findMany({
            where: {
                userId: userId ?? ""
            }
        }),
        lessonsCompleted: await db.lessonsCompleted.findMany({
            where: {
                userId: userId ?? ""
            }
        })
    }

    return json(data)
}

export default function Dashboard() {
    const data = useLoaderData<LoaderData>()

    const homeworkCompletedStats = () => {
        const hwCompletedCount = data.homeworkCompleted.filter(hw => hw.lastCompletionDate).length;

        return (
            <Text>
                Homeworks Completed: {hwCompletedCount} / {data.homeworkCompleted.length}
            </Text>
        )
    }

    const challengesCompletedStats = () => {
        const challengesCompletedCount = data.challengesCompleted.filter(c => c.completedCount > 0).length

        return (
            <Box>
                <Text>
                    Challenges completed: {challengesCompletedCount} / {data.challengesCompleted.length}
                </Text>
                <Text>
                    Total Challenges Completed: {data.challengesCompleted.reduce((acc, i) => {
                        return acc + i.completedCount
                    }, 0)}
                </Text>
            </Box>
        )
    }

    const lessonsCompletedStats = () => {
        const lessonsCompletedCount = data.lessonsCompleted.filter(l => l.completionDate).length

        return ( 
            <Box>
                <Text>
                    Lessons completed: {lessonsCompletedCount} / {data.lessonsCompleted.length}
                </Text>
            </Box>
        )
    }

    return (
        <Box>
            <Title order={1}>Dashboard</Title>

            {homeworkCompletedStats()}
            {challengesCompletedStats()}
            {lessonsCompletedStats()}

            <Text>
                Fifty time placeholder
            </Text> 
        </Box>



    )
}