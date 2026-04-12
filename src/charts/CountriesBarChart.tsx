import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  townNumberPerCountry,
  relationNumberPerCountry,
} from "@/components/TwinTownsMap";

const data = Object.entries(relationNumberPerCountry)
  .sort((a, b) => b[1] - a[1])
  .map(([country, relationCount]) => ({
    country,
    relations: relationCount,
    towns: townNumberPerCountry[country] || 0,
  }));

const CountriesBarChart = () => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "2000px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 20,
        left: 10,
        bottom: 100,
      }}
      barGap={200}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="country"
        angle={-90}
        textAnchor="end"
        interval={0}
        style={{
          fontSize: "0.8rem",
        }}
        tick={{ dx: -6, dy: 5 }}
      />
      <YAxis
        width="auto"
        style={{
          fontSize: "0.8rem",
        }}
      />
      <Tooltip cursor={false} />
      <Legend verticalAlign="top" height={36} />
      <Bar
        dataKey="relations"
        name="Relations"
        fill="#007878"
        activeBar={{ fill: "#F7C860" }}
        radius={[10, 10, 0, 0]}
      />
      <Bar
        dataKey="towns"
        name="Towns"
        fill="#00acac"
        activeBar={{ fill: "#F0F0C8" }}
        radius={[10, 10, 0, 0]}
      />
    </BarChart>
  );
};

export default CountriesBarChart;
