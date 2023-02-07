import { getAuth } from "@clerk/remix/ssr.server"
import { Title, Text, Box, Container, Grid } from "@mantine/core"
import type { ChallengesCompleted, HomeworkCompleted, LessonsCompleted } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { db } from "~/utils/db.server"

ChartJS.register(ArcElement, Legend, Tooltip)
type LoaderData = {
    homeworkCompleted: Array<HomeworkCompleted>,
    challengesCompleted: Array<ChallengesCompleted>,
    lessonsCompleted: Array<LessonsCompleted>
}

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)

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

        const chartData = {
            labels: ['Complete', 'Incomplete'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [hwCompletedCount, data.homeworkCompleted.length],
                    backgroundColor: [
                        'rgba(0, 255, 0, 0.2)',
                        'rgba(255, 0, 0, 0.2)',
                    ],
                    borderColor: [
                        'rgba(0, 255, 0, 0.2)',
                        'rgba(255, 0, 0, 0.2)',
                    ],
                    borderWidth: 1,
                },
            ],
        };


        return (
            <Box style={{
                width: '25rem',
                height: 'auto'
            }}>
                <Title order={2}>Homework Completed</Title>
                <Doughnut data={chartData} />
            </Box>

        )
    }

    const challengesCompletedStats = () => {
        const challengesCompletedCount = data.challengesCompleted.filter(c => c.completedCount > 0).length

        const chartData = {
            labels: ['Complete', 'Incomplete'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [challengesCompletedCount, data.challengesCompleted.length],
                    backgroundColor: [
                        'rgba(0, 255, 0, 0.2)',
                        'rgba(255, 0, 0, 0.2)',
                    ],
                    borderColor: [
                        'rgba(0, 255, 0, 0.2)',
                        'rgba(255, 0, 0, 0.2)',
                    ],
                    borderWidth: 1,
                },
            ],
        };


        // return ( 
        // <Box style={{
        //     width: '25rem', 
        //     height: 'auto'
        // }}>
        //     <Title order={2}>Homework Completed</Title>
        //      <Doughnut data={chartData} />
        // </Box>

        // )

        return (
            <Box>
                <Box style={{
                    width: '25rem',
                    height: 'auto'
                }}>
                    <Title order={2}>Challenges Completed</Title>
                    <Doughnut data={chartData} />
                </Box>
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

            <Grid>
                {homeworkCompletedStats()}
                {challengesCompletedStats()}
                {lessonsCompletedStats()}
            </Grid>


            <Text>
                Fifty time placeholder
            </Text>
        </Box>



    )
}