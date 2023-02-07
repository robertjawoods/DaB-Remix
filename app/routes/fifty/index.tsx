import { Box, Title, Text, Button } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { useTimer } from "~/components/useTimer";

export const meta: MetaFunction = () => {
  return {
    title: "50% Rule",
  };
};

export default function Fifty() {
  const {seconds, hours, minutes, setIsRunning } = useTimer()

  const submitTime = () => {};

  return (
    <Box>
      <Title order={1}>50% Rule</Title>

      <Box>
        <Text>
          Time: {hours}:{minutes}:{seconds}
        </Text>
        <Box>
          <Button onClick={() => setIsRunning(true)}>Start Timer</Button>
          <Button onClick={() => setIsRunning(false)}>Pause Timer</Button>
          <Button>Submit Time</Button>
        </Box>
      </Box>
    </Box>
  );
}
