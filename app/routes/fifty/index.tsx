import { Box, Title, Text, Button} from "@mantine/core"
import type { MetaFunction } from "@remix-run/node"
import { useStopwatch } from "react-timer-hook"

export const meta: MetaFunction = () => {
    return { 
        title: "50% Rule"
    }
}

export default function Fifty() {
    const {
        seconds, 
        minutes,
        hours,
        start, 
        pause, 
        isRunning,
        reset
    } = useStopwatch({autoStart: false})

    const submitTime = () => {

    }

    return (
        <Box> 
            <Title order={1}>50% Rule</Title>

            <Box> 
                <Text>
                    Time: {hours}:{minutes}:{seconds}
                </Text>
                <Box>
                    <Button onClick={start}>
                        Start Timer
                    </Button>
                    <Button onClick={pause}>
                        Pause Timer
                    </Button>
                    <Button>
                        Submit Time
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}