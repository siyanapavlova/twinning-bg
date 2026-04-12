import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
// import { RechartsDevtools } from '@recharts/devtools';
import {
  townNumberPerCountry,
  relationNumberPerCountry,
} from "@/components/TwinTownsMap";

const CountriesBarChart = () => {
  const data = Object.entries(townNumberPerCountry)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({
      country: country,
      towns: count,
    }));

  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "1000px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="country"
        angle={-90}
        textAnchor="end"
        style={{
          fontSize: "0.8rem",
        }}
      />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="towns"
        fill="#007878"
        activeBar={{ fill: "gold", stroke: "purple" }}
        radius={[10, 10, 0, 0]}
      />
      {/* <RechartsDevtools /> */}
    </BarChart>
  );
};

export default CountriesBarChart;
