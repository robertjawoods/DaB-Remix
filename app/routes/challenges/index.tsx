import { getAuth } from "@clerk/remix/ssr.server"
import { Button, Table, Title } from "@mantine/core"
import type { ChallengesCompleted } from "@prisma/client"
import { ActionFunction, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { formatDate } from "~/utils/formatDate";

import { db } from "~/utils/db.server"

type LoaderData = { challenges: Array<ChallengesCompleted> }

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)

    if (!userId)
        return redirect("/signin")

    const data: LoaderData = {
        challenges: await db.challengesCompleted.findMany({
            where: {
                userId: userId ?? ""
            },
            include: {
                challenge: true
            },
            orderBy: {
                challengeId: "asc"
            }
        })
    }

    return json(data)
}

export const action: ActionFunction =  async (args) => {
    const { userId } = await getAuth(args)


    if (!userId) {
        return null
    }

    const body = await args.request.formData();
    const challengeId = Number(body.get("challengeId") ?? 0) 


    await db.challengesCompleted.update({
        where: {
            challengeId_userId: { 
                challengeId: challengeId,
                userId: userId ?? ""
            }
        }, 
        data: {
            completedCount: { increment: 1 }, 
            lastCompletionDate: new Date()
        }
    })

    return null
}

export const meta: MetaFunction = () => {
    return { 
        title: "Challenges"
    }
}

export default function Challenges() {
    const data = useLoaderData<LoaderData>()

    const rows = data.challenges.map(challenge => (
        <tr key={challenge.id}>
            <td>{challenge.challenge.name}</td>
            <td>{challenge.completedCount}</td>
            <td>{formatDate(challenge.lastCompletionDate) ?? "Never"}</td>
            <td>
                <Form method="post">
                    <input type={"hidden"} name="challengeId" value={challenge.id} />
                    <Button type="submit">Log Completion</Button>
                </Form>                
            </td>
        </tr>
    ))

    return (
        <>
            <Title order={1}>Challenges</Title>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Completed Count</th>
                        <th>Last Completion Date</th>
                        <th>Complete</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>

    )
}