import { getAuth } from "@clerk/remix/ssr.server"
import { Table, Title } from "@mantine/core"
import type { LessonsCompleted } from "@prisma/client"
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { logger } from "~/utils/logger"
import { db } from "~/utils/db.server"
import { LessonRow } from "~/components/LessonRow";

type LoaderData = { lessons: Array<LessonsCompleted> }

export const loader: LoaderFunction = async ({ request }) => {
    const { userId } = await getAuth(request)

    const data: LoaderData = {
        lessons: await db.lessonsCompleted.findMany({
            where: {
                userId: userId ?? ""
            },
            include: {
                lesson: {
                    select: {
                        id: true,
                        name: true
                    }
                },
            },
            orderBy: {
                lessonId: 'asc'
            }
        })
    }

    return json(data)
}

export const action: ActionFunction = async ({ request }) => {
    const { userId } = await getAuth(request)
    const formData = await request.formData();

    console.log(formData.entries())

    const watchedVideo = formData.get("watchedVideo") 
    const readText = formData.get("readText")
    const lessonId = Number(formData.get("lessonId"))

    const watchedVideoBool = watchedVideo === 'true' || watchedVideo === 'on'
    const readTextBool = readText === 'true' || readText === 'on'


    logger?.info("Updating lesson completed for user", {
        userId: userId,
        readText: readText === 'true' || readText === 'on',
        watchedVideo: watchedVideo === 'true' || watchedVideo === 'on',
        lessonId: lessonId
    })

    const result = await db.lessonsCompleted.update({
        where: {
            lessonId_userId: {
                lessonId: lessonId,
                userId: userId ?? ""
            }
        },
        data: {
            watchedVideo: watchedVideoBool,
            readText: readTextBool,
            completionDate: watchedVideoBool && readTextBool ? new Date() : null
        }
    })    

    return json({newValue: result}, 200)
}

export const meta: MetaFunction = () => {
    return {
        title: "Lessons"
    }
} 

export default function Lessons() {
    const data = useLoaderData<LoaderData>();

    const rows = data.lessons.map(lesson => {
        return (
            <LessonRow lesson={lesson as LessonsCompleted} key={lesson.lessonId} />
        );
    })

    // const rows = <LessonRow lesson={data.lessons[0] as LessonsCompleted} key={data.lessons[0].lessonId} />


    return (
        <>
            <Title order={1}>Lessons</Title>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Read Text?</th>
                        <th>Watched Video?</th>
                        <th>Completion Date</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}