import { ArcLayer } from "deck.gl";
import type { Arc, Town } from "../components/TwinTownsMap";

interface Props {
    data: Arc[],
    townIndex: Record<string, Town>;
    hoveredArc: Arc | null;
    onHover: (arc: Arc | null) => void;
}

const createTwinningLayer = ({data, townIndex, hoveredArc, onHover}: Props) => 
    new ArcLayer({
        id: "arcs",
        data: data,
        getSourcePosition: (d: Arc) =>
          townIndex[d.from].coordinates as [number, number],
        getTargetPosition: (d: Arc) =>
          townIndex[d.to].coordinates as [number, number],

        getWidth: d => hoveredArc && d.from === hoveredArc.from && d.to === hoveredArc.to ? 4 : 1,
        widthUnits: "pixels",

        updateTriggers: {
          getWidth: hoveredArc
        },

        getSourceColor: [23, 20, 201],
        getTargetColor: [227, 186, 20],
        greatCircle: true,
        pickable: true,
        onHover: (info) => onHover(info.object ?? null),
        autoHighlight: true,
        transitions: {
          getWidth: 150
        }
    });

export default createTwinningLayer;