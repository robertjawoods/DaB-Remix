import { SignIn } from "@clerk/remix";
import { Box } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return { 
        title: "Sign In"
    }
}

export default function SignInPage() {
    return (
        <Box style={{
            paddingTop: 20
        }}>
            <SignIn />
        </Box>
    )
}