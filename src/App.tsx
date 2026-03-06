import TwinTownsMap from "./components/TwinTownsMap";
import NavBar from "./components//NavBar";
import "./App.css";
import { Box, Flex } from "@chakra-ui/react";

const App = () => {
  return (
    <div className="App">
      <Flex direction="column" height="100vh">
        <Box bgColor="gray.800" color="white" padding={1}>
          <NavBar></NavBar>
        </Box>
        <Box flex="1" position="relative">
          <TwinTownsMap />
        </Box>
      </Flex>
    </div>
  );
};

export default App;
