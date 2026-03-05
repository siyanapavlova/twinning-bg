import { ScatterplotLayer } from "deck.gl";
import type { Town } from "../components/TwinTownsMap";


interface Props {
    data: Town[],
    activeTowns: string[],
    hoveredTown: string | null,
    selectedTown: string | null,
    onClick: (town: Town) => void;
    onHover: (town: Town | null) => void;
}

const ACTIVE_ALPHA = 255;
const DIM_ALPHA = 100;

const createTownsLayer = ({data, activeTowns, hoveredTown, selectedTown, onHover, onClick}: Props) => {return [
    new ScatterplotLayer({
        id: "towns-pick",
        data,
        pickable: true,
        pickingRadius: 100,
        getPosition: (t) => t.coordinates,
        getRadius: 10,
        radiusUnits: "pixels",
        getFillColor: [0,0,0,0],

        onClick: (info, event) => {
          if (info.object) {
            onClick(info.object);
            event.stopPropagation();
          }
        },

        onHover: (info, event) => {
          onHover(info.object ?? null);
          if (info.object) {
            event.stopPropagation();  // <- stop drag when hovering town
          }
          // event.stopPropagation();
          // onHover(info.object ? info.object : null);
        },
    }),
    new ScatterplotLayer({
      id: "towns-render",
      data,
      pickable: false,
      getPosition: (t) => t.coordinates,
      getRadius: (town) => {
        // if (activeTowns.includes(town.id)) return 3;
        return town.id === hoveredTown || town.id === selectedTown ? 7 : 2;
      },
      radiusUnits: "pixels",
      getFillColor: (town) => {
        if (!activeTowns.includes(town.id)) return [100, 100, 100, DIM_ALPHA];
        return town.id === hoveredTown || town.id === selectedTown ? [182, 55, 84] : [100, 100, 100, ACTIVE_ALPHA];
      },
      updateTriggers: {
        getFillColor: [hoveredTown, selectedTown, activeTowns],
        getRadius: [hoveredTown, selectedTown, activeTowns]
      },

      transitions: {
        getFillColor: 100,
        getRadius: 150,
      }
    })
  ]}


export default createTownsLayer;