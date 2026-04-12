import { Flex, Heading, HStack, Image, List } from "@chakra-ui/react";
import About from "./About";
import logo from "../assets/logo.png";

import { NavLink } from "react-router-dom";

import { FiMap } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";

const NavBar = () => {
  return (
    <Flex justify="space-between" direction="column">
      <NavLink to="/twinning-bg/">
        <HStack padding={3} marginRight={3}>
          <Image
            src={logo}
            alt="Twinning BG Logo"
            height="17px"
            marginBottom={2}
          />
          <Heading size="md">Twinning BG</Heading>
        </HStack>
      </NavLink>
      <List.Root>
        <List.Item>
          <NavLink to="/twinning-bg/">
            <HStack alignItems="center">
              <FiMap />
              Map
            </HStack>
          </NavLink>
        </List.Item>
        <List.Item>
          <NavLink to="/twinning-bg/stats">
            <HStack alignItems="center">
              <IoIosStats />
              Statistics
            </HStack>
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
