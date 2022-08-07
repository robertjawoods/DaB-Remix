import { Box, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => { 
  return {
    title: "DaB Progress"
  }
}

export default function Index() {
  return (
    <Box>
      <Title order={1}>DaB Progress</Title>
    </Box>
  );
}
