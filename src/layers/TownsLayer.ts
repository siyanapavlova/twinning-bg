import { ScatterplotLayer } from "deck.gl";
import type { Town } from "@/types.ts";
import "../index.css";

interface Props {
    data: Town[],
    activeTowns: Town[],
    allTownsActive: boolean,
    hoveredTown: string | null,
    selectedTown: string | null,
    townSelection: boolean,
    countrySelection: boolean,
    showAllTowns: boolean,
    // zoom: number,
    // fontReady: boolean,
    onClick: (town: Town) => void;
    onHover: (town: Town | null) => void;
}

const ACTIVE_ALPHA = 180;
const DIM_ALPHA = 100;

const createTownsLayer = ({
    data,
    activeTowns,
    allTownsActive,
    hoveredTown,
    selectedTown,
    townSelection,
    countrySelection,
    showAllTowns,
    // zoom,
    // fontReady,
    onHover,
    onClick
  }: Props) => {
    
    // const labelCharset = Array.from(
    //   new Set(data.flatMap(t => [...t.name]))
    // ).join("");

    // console.log(labelCharset);
    
    return [
    new ScatterplotLayer({
        id: "towns-pick",
        data: showAllTowns ? data : activeTowns,
        pickable: true,
        pickingRadius: 100,
        getPosition: (t) => t.coordinates,
        getRadius: 10,
        radiusUnits: "pixels",
        getFillColor: [0,0,0,0],

        onClick: (info) => onClick(info.object ?? null),

        onHover: (info) => onHover(info.object ?? null),
    }),
    new ScatterplotLayer({
      id: "towns-render",
      data: showAllTowns ? data : activeTowns,
      pickable: false,
      getPosition: (t) => t.coordinates,
      getRadius: (town) => {
        if (town.id === hoveredTown || town.id === selectedTown) return 7;
        if (activeTowns.includes(town)) return 3;
        return 2;
      },
      radiusUnits: "pixels",
      getFillColor: (town) => {
        if (town.id === hoveredTown || town.id === selectedTown) return [182, 55, 84];
        if (allTownsActive) return [90, 5, 34, ACTIVE_ALPHA]; //[100, 100, 100];
        if (activeTowns.includes(town) && (townSelection || town.country === "Bulgaria")) return [247, 200, 96];
        if (activeTowns.includes(town) && countrySelection) return [182, 55, 84];
        return [90, 5, 34, DIM_ALPHA];
      },
      updateTriggers: {
        getFillColor: [hoveredTown, selectedTown, activeTowns, allTownsActive],
        getRadius: [hoveredTown, selectedTown, activeTowns, allTownsActive]
      },

      transitions: {
        getFillColor: 100,
        getRadius: 150,
      }
    }),

    

    // fontReady && new TextLayer({
    //   id: "town-labels",
    //   data,
    //   getPosition: (t) => t.coordinates,
    //   getText: (t) => t.name,

    //   // fontFamily: "RobotoDeckGL, Arial Unicode MS, sans-serif",
    //   fontFamily: "Arial Unicode MS", 

    //   fontSettings: {
    //     // fontFamily: "RobotoDeckGL",
    //     characterSet: "auto",
    //   //   buffer: 3,
    //     sdf: true,
    //   },

    //   getSize: () => Math.max(20, zoom * 1.5),
    //   getColor: [30, 30, 30],
    //   getTextAnchor: "start",
    //   getAlignmentBaseline: "center",
    //   getPixelOffset: [8, 0],
    //   sizeUnits: "pixels",
    //   billboard: true,
    //   visible: zoom > 7,
    // })
  ]}


export default createTownsLayer;