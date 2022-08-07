import { getAuth } from "@clerk/remix/ssr.server"
import { Button, Table, Title } from "@mantine/core"
import type { ChallengesCompleted } from "@prisma/client"
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"

import { db } from "~/utils/db.server"

type LoaderData = { challenges: Array<ChallengesCompleted> }

export const loader: LoaderFunction = async ({request}) => {
    const {userId} = await getAuth(request)

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

export const action: ActionFunction = async ({request}) => {
    const body = await request.formData();
    const challengeId = Number(body.get("challengeId") ?? 0) 
    const {userId} = await getAuth(request)

    await db.challengesCompleted.update({
        where: {
            challengeId_userId: { 
                challengeId: challengeId,
                userId: userId ?? ""
            }
        }, 
        data: {
            completedCount: { increment: 1} 
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
                        <th>Complete</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>

    )
}