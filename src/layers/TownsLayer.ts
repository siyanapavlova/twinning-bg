import { ScatterplotLayer } from "deck.gl";
import type { Town } from "../components/TwinTownsMap";

interface Props {
    data: Town[],
    activeTowns: string[],
    allTownsActive: boolean,
    hoveredTown: string | null,
    selectedTown: string | null,
    townSelection: Boolean,
    countrySelection: Boolean,
    onClick: (town: Town) => void;
    onHover: (town: Town | null) => void;
}

// const ACTIVE_ALPHA = 255;
const DIM_ALPHA = 100;

const createTownsLayer = ({data, activeTowns, allTownsActive, hoveredTown, selectedTown, townSelection, countrySelection, onHover, onClick}: Props) => {return [
    new ScatterplotLayer({
        id: "towns-pick",
        data,
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
      data,
      pickable: false,
      getPosition: (t) => t.coordinates,
      getRadius: (town) => {
        if (town.id === hoveredTown || town.id === selectedTown) return 7;
        if (activeTowns.includes(town.id)) return 3;
        return 2;
      },
      radiusUnits: "pixels",
      getFillColor: (town) => {
        if (town.id === hoveredTown || town.id === selectedTown) return [182, 55, 84];
        if (allTownsActive) return [100, 100, 100];
        if (activeTowns.includes(town.id) && townSelection) return [247, 200, 96];
        if (activeTowns.includes(town.id) && countrySelection) return [182, 55, 84];
        return [100, 100, 100, DIM_ALPHA];
      },
      updateTriggers: {
        getFillColor: [hoveredTown, selectedTown, activeTowns, allTownsActive],
        getRadius: [hoveredTown, selectedTown, activeTowns, allTownsActive]
      },

      transitions: {
        getFillColor: 100,
        getRadius: 150,
      }
    })
  ]}


export default createTownsLayer;