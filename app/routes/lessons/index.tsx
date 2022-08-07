import { getAuth } from "@clerk/remix/ssr.server"
import { Checkbox, Table, Title } from "@mantine/core"
import type { LessonsCompleted } from "@prisma/client"
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"
import { formatDate } from "~/utils/formatDate";

type LoaderData = { lessons: Array<LessonsCompleted> }

export const loader: LoaderFunction = async ({request}) => {
    const {userId} = await getAuth(request)

    const data: LoaderData = {
        lessons: await db.lessonsCompleted.findMany({
            where: {
                userId: userId ?? ""
            },
            include: {
                lesson: true
            }
        })
    }

    return json(data)
}

export const meta: MetaFunction = () => {
    return { 
        title: "Lessons"
    }
}

export default function Lessons() {
    const data = useLoaderData<LoaderData>()

    const rows = data.lessons.map(lesson => (
        <tr key={lesson.id}>
            <td>{lesson.lesson.name}</td>
            <td>
                <Form>
                    <Checkbox checked={lesson.readText} />
                </Form>
            </td>
            <td>{lesson.watchedVideo}</td>
            <td>{formatDate(lesson.completionDate)}</td>
        </tr>
    ))

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