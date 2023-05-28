import { SignUp } from "@clerk/remix";
import { Box } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function SignUpPage() {
  return (
    <Box
      style={{
        paddingTop: 20,
      }}
    >
      <SignUp />
    </Box>
  );
}
