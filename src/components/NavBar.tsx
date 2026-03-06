import { Center, Flex, Heading, HStack, Image } from "@chakra-ui/react";
import "./navbar.css";
import About from "./About";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <Flex justify="space-between">
      <HStack padding={2}>
        <Image src={logo} alt="Twinning BG Logo" height="25px" marginLeft={2} />
        <Heading>Twinning BG</Heading>
      </HStack>
      <Center>
        <About />
      </Center>
    </Flex>
  );
};

export default NavBar;
