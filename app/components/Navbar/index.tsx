import { useAuth } from "@clerk/remix";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  createStyles,
  Header,
  useMantineColorScheme,
} from "@mantine/core";

import { NavLink } from "@remix-run/react";

const useStyles = createStyles((theme, _params, getRef) => ({
  navbar: {
    gap: 70,
    paddingTop: 5,
  },
}));

export const Navbar = () => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  const { userId, signOut } = useAuth();

  const accountCta = () =>
    !userId ? (
      <Box>
        <NavLink
          to={"/signup"}
          style={{
            paddingRight: 70,
          }}
        >
          <Button>Sign Up</Button>
        </NavLink>
        <NavLink to={"/signin"}>
          <Button>Sign In</Button>
        </NavLink>
      </Box>
    ) : (
      <Button onClick={() => signOut()}>Sign Out</Button>
    );

  return (
    <Header height={50}>
      <Center className={classes.navbar}>
        <NavLink to={"/dashboard"}>Dashboard</NavLink>|
        <NavLink to={"/lessons"}>Lessons</NavLink>|
        <NavLink to={"/homework"}>Homework</NavLink>|
        <NavLink to={"/challenges"}>Challenges</NavLink>|
        <NavLink to={"/fifty"}>50% Timer</NavLink>|{accountCta()}|
        <ActionIcon
          onClick={() => {
            toggleColorScheme();
          }}
        >
          {colorScheme === "dark" ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </ActionIcon>
      </Center>
    </Header>
  );
};
