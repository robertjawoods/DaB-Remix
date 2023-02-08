import { getAuth } from "@clerk/remix/ssr.server";
import { Button, Table, Title } from "@mantine/core"
import type { HomeworkCompleted } from "@prisma/client"
import { ActionFunction, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server"
import { formatDate } from "~/utils/formatDate";
import { logger } from "~/utils/logger";

type LoaderData = { homework: Array<HomeworkCompleted> };

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)

    if (!userId)
        return redirect("/signin")

    logger?.info("Fetching homework completed data for user", {
        userId: userId
    })

    try {
        const data: LoaderData = {
            homework: await db.homeworkCompleted.findMany({
                where: {
                    userId: userId ?? ""
                },
                include: {
                    homework: true
                }
            })
        }    

        return json(data)
    } catch (err: any) { 
        logger?.error("Unable to load homework completed data for user", { 
            userId: userId, 
            message: err.message
        })
    }      
}

export const action: ActionFunction =  async (args) => {
    const { userId } = await getAuth(args);
    const body = await args.request.formData();
    const homeworkId = Number(body.get("homeworkId") ?? 0)

    await db.homeworkCompleted.update({
        where: {
            homeworkId_userId: {
                homeworkId: homeworkId,
                userId: userId ?? ""
            }
        },
        data: {
            lastCompletionDate: new Date()
        }
    })

    return null
}

export const meta: MetaFunction = () => {
    return { 
        title: "Homework"
    }
}

export default function HomeworkPage() {
    const data = useLoaderData<LoaderData>()


    const rows = data.homework.map(homework => (
        <tr key={homework.id}>
            <td>{homework.homework.name}</td>
            <td>{formatDate(homework.lastCompletionDate)}</td>
            <td>
                <Form method="post">
                    <input type={"hidden"} name="homeworkId" value={homework.id} />
                    <Button type="submit">
                        Complete
                    </Button>
                </Form>
            </td>
        </tr>
    ))

    return (
        <>
            <Title order={1}>Homework</Title>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Completed Date</th>
                        <th>Log Completion</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>

    )
}