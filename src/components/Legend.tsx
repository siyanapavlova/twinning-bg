interface Props {
  min: number;
  max: number;
  ticks: number;
  colorScale: (t: number) => [number, number, number];
}

const Legend = ({ min, max, ticks, colorScale }: Props) => {
  // calculate log-spaced tick values
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const tickValues = Array.from({ length: ticks }, (_, i) => {
    const t = i / (ticks - 1);
    return Math.round(Math.exp(logMin + t * (logMax - logMin)));
  });

  const colorMin = colorScale(0);
  const colorMax = colorScale(1);

  const colorMinCSS = `rgba(${colorMin[0]},${colorMin[1]},${colorMin[2]}, 1)`;
  const colorMaxCSS = `rgba(${colorMax[0]},${colorMax[1]},${colorMax[2]}, 1)`;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <p style={{ marginTop: 1, marginBottom: 5, fontSize: 13 }}>
        Twin relations
      </p>
      <div
        style={{
          marginBottom: 2,
          width: 200,
          height: 10,
          background: `linear-gradient(90deg, ${colorMinCSS}, ${colorMaxCSS})`,
        }}
      ></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: 200,
          height: 10,
        }}
      >
        {tickValues.map((v, i) => (
          <span key={i} style={{ fontSize: 10 }}>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Legend;
