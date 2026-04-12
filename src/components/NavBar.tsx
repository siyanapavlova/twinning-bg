import { Flex, Heading, HStack, Image, List, Stack } from "@chakra-ui/react";
import About from "./About";
import logo from "../assets/logo.png";

import { NavLink } from "react-router-dom";

import { FiMap } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";

const NavBar = () => {
  return (
    <Flex justify="space-between" direction="column">
      <HStack padding={3} marginRight={3}>
        <Image
          src={logo}
          alt="Twinning BG Logo"
          height="17px"
          marginBottom={2}
        />
        <Heading size="md">Twinning BG</Heading>
      </HStack>
      <List.Root>
        <List.Item>
          <NavLink to="/twinning-bg/">
            <Stack direction="row" alignItems="center">
              <FiMap />
              Map
            </Stack>
          </NavLink>
        </List.Item>
        <List.Item>
          <NavLink to="/twinning-bg/stats">
            <Stack direction="row" alignItems="center">
              <IoIosStats />
              Statistics
            </Stack>
          </NavLink>
        </List.Item>
        <List.Item>
          <About />
        </List.Item>
      </List.Root>
    </Flex>
  );
};

export default NavBar;
