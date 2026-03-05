import { Flex, Heading } from "@chakra-ui/react";
import "./navbar.css";
import About from "./About";

const NavBar = () => {
  return (
    <Flex justify="space-between">
      <Heading>Twinning BG</Heading>
      <About />
    </Flex>
  );
};

export default NavBar;
