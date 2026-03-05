interface Props {
  min: number;
  max: number;
  colorScale: (t: number) => [number, number, number];
}

const Legend = ({ min, max, colorScale }: Props) => {
  const tickValues = [min, 15, 75, max];

  return (
    <div style={{ position: "absolute", bottom: 20, right: 20 }}>
      <p style={{ padding: 0, marginBottom: 5, fontSize: 14 }}>Twin counts</p>
      <div
        style={{
          marginBottom: 2,
          width: 200,
          height: 10,
          background: `linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)`,
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
