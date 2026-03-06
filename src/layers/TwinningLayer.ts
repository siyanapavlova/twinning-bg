import { ArcLayer } from "deck.gl";
import type { Arc, Town } from "@/types.ts";

interface Props {
    data: Arc[],
    townIndex: Record<string, Town>;
    hoveredArc: Arc | null;
    selectedArc: Arc | null;
    onHover: (arc: Arc | null) => void;
    onClick: (arc: Arc) => void;
}

const BASE_WIDTH = 1;
const HOVER_WIDTH = 4;

const ACTIVE_ALPHA = 255;
const DIM_ALPHA = 100;

const createTwinningLayer = ({data, townIndex, hoveredArc, selectedArc, onHover, onClick}: Props) => {return [
  new ArcLayer({
        id: "arcs-pick",
        data: data,
        getSourcePosition: (d: Arc) =>
          townIndex[d.from].coordinates as [number, number],
        getTargetPosition: (d: Arc) =>
          townIndex[d.to].coordinates as [number, number],
        getWidth: 8,
        getSourceColor: [0,0,0,0],
        getTargetColor: [0,0,0,0],
        greatCircle: true,
        pickable: true,
        onHover: (info) => onHover(info.object ?? null),
        onClick: (info) => onClick(info.object ?? null),

        // to disable depth buffering
        parameters: {
          depthWrite: false,
          depthTest: false,
        },
    }),
    new ArcLayer({
        id: "arcs-render",
        data: data,
        getSourcePosition: (d: Arc) =>
          townIndex[d.from].coordinates as [number, number],
        getTargetPosition: (d: Arc) =>
          townIndex[d.to].coordinates as [number, number],

        getWidth: (arc) => {
          if (hoveredArc && arc.from === hoveredArc.from && arc.to === hoveredArc.to) return HOVER_WIDTH;
          if (arc === selectedArc) return 2;
          return BASE_WIDTH;
        },
        widthUnits: "pixels",

        updateTriggers: {
          getWidth: [hoveredArc, selectedArc],
          getSourceColor: hoveredArc,
          getTargetColor: hoveredArc
        },

        getSourceColor: d => {

          const alpha =
            hoveredArc === null
              ? ACTIVE_ALPHA
              : d.from === hoveredArc.from && d.to === hoveredArc.to
                ? ACTIVE_ALPHA
                : DIM_ALPHA;

          return [96, 63, 132, alpha]; // purple
        },
        getTargetColor:  d => {
          const alpha =
            hoveredArc === null
              ? ACTIVE_ALPHA
              : d.from === hoveredArc.from && d.to === hoveredArc.to
                ? ACTIVE_ALPHA
                : DIM_ALPHA;
                
          return [96, 63, 132, alpha]; // purple

        },
        greatCircle: true,
        pickable: false,
        transitions: {
          getWidth: 150
        }
    })
];}

export default createTwinningLayer;