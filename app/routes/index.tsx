import { Box, Title, Text } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "DaB Progress",
  };
};

export default function Index() {
  return (
    <Box>
      <Title order={1}>DaB Progress</Title>
      <Text>
        Welcome to Draw A Box Progress, a site where you can track your progress
        through the Draw A Box course.
      </Text>
      <Text>
        This website is unofficial and aimed at people like myself who like to
        track their progress to keep themselves accountable.
      </Text>
    </Box>
  );
}
