import { Checkbox } from "@mantine/core";
import type { LessonsCompleted } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { formatDate } from "~/utils/formatDate";

type LessonRowProps = { lesson: LessonsCompleted };
 const LessonRow = ({ lesson }: LessonRowProps) => {   
    const fetcher = useFetcher(); 
    const [watchedVideo, setWatchedVideo] = useState(lesson.watchedVideo)
    const [readText, setReadText] = useState(lesson.readText)

    const handleChange = (e: FormEvent<HTMLFormElement>) => {
        fetcher.submit(e.currentTarget);
    }



    return (
        <tr key={lesson.id}>
            <td>{lesson.lesson.name}</td>
            <td>
                <fetcher.Form method="post" action="/lessons?index" onChange={(e) => handleChange(e)}>
                    <input type={"hidden"} name="lessonId" value={lesson.id} />
                    <input type={"hidden"} name="watchedVideo" value={String(watchedVideo)} />
                    <Checkbox name="readText" checked={readText} onChange={() => setReadText(prev => !prev)} />
                </fetcher.Form>
            </td>
            <td>
                <fetcher.Form method="post" action="/lessons?index" onChange={(e) => handleChange(e)} id="watched-video-form">
                    <input type={"hidden"} name="lessonId" value={lesson.id}/>
                    <input type={"hidden"} name="readText" value={String(readText)}  />
                    <Checkbox name="watchedVideo" checked={watchedVideo} onChange={() => setWatchedVideo(prev => !prev)}/>
                </fetcher.Form>
            </td>
            <td>{formatDate(lesson.completionDate)}</td>
        </tr>
    )
}

export {LessonRow}