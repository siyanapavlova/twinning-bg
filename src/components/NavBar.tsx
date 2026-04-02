import { Flex, Heading, HStack, Image, List } from "@chakra-ui/react";
import About from "./About";
import logo from "../assets/logo.png";

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
          <About />
        </List.Item>
      </List.Root>
    </Flex>
  );
};

export default NavBar;
