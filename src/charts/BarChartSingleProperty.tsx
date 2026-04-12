import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: { country: string; property: number }[];
  propertyName: string;
  fillColor: string;
  activeBarColor: string;
}

const BarChartSingleProperty = ({
  data,
  propertyName,
  fillColor,
  activeBarColor,
}: Props) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "2000px",
        maxHeight: "80vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 20,
        left: 10,
        bottom: 200,
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
        dataKey="property"
        name={propertyName}
        fill={fillColor}
        activeBar={{ fill: activeBarColor }}
        radius={[10, 10, 0, 0]}
      />
    </BarChart>
  );
};

export default BarChartSingleProperty;
