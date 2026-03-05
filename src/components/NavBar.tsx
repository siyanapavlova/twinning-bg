import { Center, Flex, Heading } from "@chakra-ui/react";
import "./navbar.css";
import About from "./About";

const NavBar = () => {
  return (
    <Flex justify="space-between">
      <Center>
        <Heading marginX={5}>Twinning BG</Heading>
      </Center>
      <About />
    </Flex>
  );
};

export default NavBar;
