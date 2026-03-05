import { ArcLayer } from "deck.gl";
import type { Arc, Town } from "../components/TwinTownsMap";

interface Props {
    data: Arc[],
    townIndex: Record<string, Town>;
}

const createTwinningLayer = ({data, townIndex}: Props) => 
    new ArcLayer({
        id: "arcs",
        data: data,
        getSourcePosition: (d: Arc) =>
          townIndex[d.from].coordinates as [number, number],
        getTargetPosition: (d: Arc) =>
          townIndex[d.to].coordinates as [number, number],
        // getWidth: () => 2 + Math.sin(time) * 1.5,
        getSourceColor: [23, 20, 201],
        getTargetColor: [227, 186, 20],
        greatCircle: true,
    });

export default createTwinningLayer;