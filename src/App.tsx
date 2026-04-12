import TwinTownsMap from "./components/TwinTownsMap";
import NavBar from "./components//NavBar";
import "./App.css";
import { Grid, GridItem } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Stats from "./components/Stats";

const App = () => {
  return (
    <Router>
      <Grid
        templateAreas={{
          base: `"aside" "main"`,
          lg: `"aside main"`, // wider than 1024 pixels
        }}
        templateColumns={{
          base: "1fr",
          lg: "196.433px 1fr",
        }}
      >
        <GridItem
          area="aside"
          position="fixed"
          bgColor="gray.800"
          color="white"
          padding={1}
          height="100vh"
        >
          <NavBar></NavBar>
        </GridItem>
        <GridItem area="main" flex="1" position="relative" height="100vh">
          <Routes>
            <Route path="/" element={<TwinTownsMap />} />
            <Route path="/twinning-bg" element={<TwinTownsMap />} />
            <Route path="/twinning-bg/stats" element={<Stats />} />
          </Routes>
        </GridItem>
      </Grid>
    </Router>
  );
};

export default App;
