import { ScatterplotLayer } from "deck.gl";
import type { Town } from "../components/TwinTownsMap";

interface Props {
    townData: Town[],
    activeTowns: Town[],
    allTownsActive: boolean,
    hoveredTown: string | null,
    selectedTown: string | null,
    townSelection: boolean,
    countrySelection: boolean,
    showAllTowns: boolean,
    onClick: (town: Town) => void;
    onHover: (town: Town | null) => void;
}

// const ACTIVE_ALPHA = 255;
const DIM_ALPHA = 100;

const createTownsLayer = ({
    townData,
    activeTowns,
    allTownsActive,
    hoveredTown,
    selectedTown,
    townSelection,
    countrySelection,
    showAllTowns,
    onHover,
    onClick
  }: Props) => {return [

    new ScatterplotLayer({
        id: "towns-pick",
        data: showAllTowns ? townData : activeTowns,
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
      data: showAllTowns ? townData : activeTowns,
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
        if (allTownsActive) return [100, 100, 100];
        if (activeTowns.includes(town) && (townSelection || town.country === "Bulgaria")) return [247, 200, 96];
        if (activeTowns.includes(town) && countrySelection) return [182, 55, 84];
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