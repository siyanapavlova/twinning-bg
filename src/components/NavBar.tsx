import {
  Flex,
  Heading,
  HStack,
  Image,
  Box,
  Text,
  Icon,
} from "@chakra-ui/react";
import About from "./About";
import logo from "../assets/logo.png";

import { NavLink } from "react-router-dom";

import { FiMap } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";

const NavBar = () => {
  return (
    <Flex justify="space-between" direction="column" height="100vh">
      <Box>
        <NavLink to="/twinning-bg/">
          <HStack padding={3} marginRight={3}>
            <Image
              src={logo}
              alt="Twinning BG Logo"
              height="17px"
              marginBottom={2}
            />
            <Heading size="xl">Twinning BG</Heading>
          </HStack>
        </NavLink>

        <NavLink to="/twinning-bg/" end>
          {({ isActive }) => (
            <HStack
              marginX={2}
              marginY={1}
              paddingX={2}
              paddingY={1}
              bg={isActive ? "gray.700" : "transparent"}
              rounded={5}
            >
              <Icon as={FiMap} />
              <Text fontSize={18}>Map</Text>
            </HStack>
          )}
        </NavLink>

        <NavLink to="/twinning-bg/stats" end>
          {({ isActive }) => (
            <HStack
              marginX={2}
              marginY={1}
              paddingX={2}
              paddingY={1}
              bg={isActive ? "gray.700" : "transparent"}
              rounded={5}
            >
              <Icon as={IoIosStats} />
              <Text fontSize={18}>Statistics</Text>
            </HStack>
          )}
        </NavLink>
      </Box>

      <Box>
        <About />
      </Box>
    </Flex>
  );
};

export default NavBar;
