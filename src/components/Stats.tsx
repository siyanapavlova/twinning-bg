import CountriesBarChart from "@/charts/CountriesBarChart";
import { Heading } from "@chakra-ui/react";
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
    <>
      <Heading>Stats</Heading>
      <CountriesBarChart />
      <BarChartSingleProperty
        data={relations}
        propertyName="Relations"
        fillColor="#007878"
        activeBarColor="#F7C860"
      />
      <BarChartSingleProperty
        data={towns}
        propertyName="Towns"
        fillColor="#00acac"
        activeBarColor="#F0F0C8"
      />
    </>
  );
};

export default Stats;
