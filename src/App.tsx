import TwinTownsMap from "./components/TwinTownsMap";
import NavBar from "./components//NavBar";
import "./App.css";
import { Box, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Stats from "./components/Stats";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Flex height="100vh">
          <Box bgColor="gray.800" color="white" padding={1}>
            <NavBar></NavBar>
          </Box>
          <Box flex="1" position="relative">
            <Routes>
              <Route path="/" element={<TwinTownsMap />} />
              <Route path="/twinning-bg" element={<TwinTownsMap />} />
              <Route path="/twinning-bg/stats" element={<Stats />} />
            </Routes>
          </Box>
        </Flex>
      </div>
    </Router>
  );
};

export default App;
