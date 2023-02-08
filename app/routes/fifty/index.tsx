import { getAuth } from "@clerk/remix/ssr.server";
import { Box, Title, Text, Button } from "@mantine/core";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { useTimer } from "~/components/useTimer";
import { db } from "~/utils/db.server";
import { formatTimeValue } from "~/utils/formatDate";

export const meta: MetaFunction = () => {
  return {
    title: "50% Rule",
  };
};




export const action: ActionFunction =  async (args) => {
  const { userId } = await getAuth(args)

  const formData = await args.request.formData();

  console.log("adding time")

  const start = formData.get("start") as string
  const end = formData.get("end") as string
  
  await db.fiftyTime.create({
    data: {
      userId: userId ?? "",
      startDate: new Date(start), 
      endDate: new Date(end)
    }
  })

  return null;
};


export default function Fifty() { 
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date())

  const {seconds, hours, minutes, setIsRunning, reset } = useTimer(() => {
    setEnd(new Date());
  })

  const submitTime = () => {};

  const startTimer = () => {
    setIsRunning(true);
    setStart(new Date());
  }; 

  const pauseTimer = () => {
    setIsRunning(false);    
  }

  return (
    <Box>
      <Title order={1}>50% Rule</Title>

      <Box>
        <Text>
          Time: {formatTimeValue(hours)}:{formatTimeValue(minutes)}:{formatTimeValue(seconds)}
        </Text>
        <Box>
          <Button onClick={startTimer}>Start Timer</Button>
          <Button onClick={pauseTimer}>Pause Timer</Button>
          <Form method="post" onSubmit={reset}>
            <input type={"hidden"} value={start.toISOString()} name="start" />
            <input type={"hidden"} value={end.toISOString()} name="end" />
            <Button type="submit">Submit Time</Button>
          </Form>
          
        </Box>
      </Box>
    </Box>
  );
}
