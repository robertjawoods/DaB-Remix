import { getAuth } from "@clerk/remix/ssr.server"
import { Checkbox, Input, Table, Title } from "@mantine/core"
import type { LessonsCompleted } from "@prisma/client"
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Form, useFetcher, useFormAction, useLoaderData, useSubmit } from "@remix-run/react"
import { logger } from "~/utils/logger"
import { useState } from "react";
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
                lesson: true,
            }, 
            orderBy: {
                lessonId: 'asc'
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

export const action: ActionFunction = async ({request}) => {  
    const {userId} = await getAuth(request)
    const formData = await request.formData();

    const watchedVideo = Boolean(formData.get("watchedVideo"));
    const readText = Boolean(formData.get("readText"));
    const lessonId = Number(formData.get("lessonId"))

    
    logger?.info("Updating lesson completed for user", {
        userId: userId, 
        readText: readText,
        watchedVideo: watchedVideo, 
        lessonId: lessonId
    })

    await db.lessonsCompleted.update({
        where: {
            lessonId_userId: { 
                lessonId: lessonId,
                userId: userId ?? ""
            }
        }, 
        data: {
            watchedVideo: watchedVideo, 
            readText: readText, 
            completionDate: watchedVideo && readText ? new Date() : null
        }
    })

    return json({}, 200)
}

export default function Lessons() {
    const data = useLoaderData<LoaderData>();
    const submit = useSubmit();


    const handleChange = (e: any) => {
        console.log("change")
        submit(e.currentTarget)
    }

    const rows = data.lessons.map(lesson => {
        return (
            <tr key={lesson.id}>
                <td>{lesson.lesson.name}</td>
                <td>
                    <Form onChange={handleChange} method="post">
                        <input type={"hidden"} value={lesson.id} name="lessonId" />
                        <input type={"hidden"} value={String(lesson.watchedVideo)} name="watchedVideo"/>
                        <Checkbox defaultChecked={lesson.readText} name="readText" />
                    </Form>
                </td>
                <td>
                    <Form onChange={handleChange} method="post">
                        <input type={"hidden"} value={lesson.id} name="lessonId" />
                        <input type={"hidden"} value={String(lesson.readText)} name="readText"/>
                        <Checkbox defaultChecked={lesson.watchedVideo} name="watchedVideo" />
                    </Form>
                </td>
                <td>{formatDate(lesson.completionDate)}</td>
            </tr>
        )
    })

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