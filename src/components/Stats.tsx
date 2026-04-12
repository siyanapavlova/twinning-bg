import CountriesBarChart from "@/charts/CountriesBarChart";
import { Box, Flex, Heading } from "@chakra-ui/react";
import {
  relationNumberPerCountry,
  townNumberPerCountry,
} from "@/components/TwinTownsMap";
import BarChartSingleProperty from "@/charts/BarChartSingleProperty";

const relations = Object.entries(relationNumberPerCountry)
  .sort((a, b) => b[1] - a[1])
  .map(([country, relationCount]) => ({
    country,
    property: relationCount,
  }));

const towns = Object.entries(townNumberPerCountry)
  .sort((a, b) => b[1] - a[1])
  .map(([country, relationCount]) => ({
    country,
    property: relationCount,
  }));

const Stats = () => {
  return (
    <Flex direction="column" alignItems="center" padding={4} gap={8}>
      <Heading color="gray.800" marginBottom={2}>
        Number of twin relations and towns per country
      </Heading>
      <CountriesBarChart />

      <Heading color="gray.800" marginBottom={2}>
        Number of twin relations per country
      </Heading>
      <BarChartSingleProperty
        data={relations}
        propertyName="Relations"
        fillColor="#007878"
        activeBarColor="#F7C860"
      />

      <Heading color="gray.800" marginBottom={2}>
        Number of twinned towns per country
      </Heading>
      <BarChartSingleProperty
        data={towns}
        propertyName="Towns"
        fillColor="#00acac"
        activeBarColor="#F0F0C8"
      />
    </Flex>
  );
};

export default Stats;
