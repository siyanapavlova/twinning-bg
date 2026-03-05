import { ScatterplotLayer } from "deck.gl";
import type { Town } from "../components/TwinTownsMap";


interface Props {
    data: Town[],
    hoveredTown: string | null,
    onClick: (town: Town) => void;
    onHover: (town: Town | null) => void;
}

const createTownsLayer = ({data, hoveredTown, onHover, onClick}: Props) => 
    new ScatterplotLayer({
        id: "towns",
        data,
        pickable: true,
        getPosition: (t) => t.coordinates,
        getRadius: (town) => {
          return town.name === hoveredTown ? 7 : 3;
        },
        radiusUnits: "pixels",
        getFillColor: (town) => {
          return town.name === hoveredTown ? [182, 55, 84] : [100, 100, 100];
        },
        onClick: (info) => {
          if (info.object) {
            onClick(info.object);
          }
        },

        onHover: (info) => {
          if (info.object) {
            onHover(info.object);
          } else {
            onHover(null);
          }
        },

        updateTriggers: {
          getFillColor: [hoveredTown],
          getRadius: [hoveredTown]
        },

        transitions: {
          getFillColor: 100,
          getRadius: 150,
        }
    })


export default createTownsLayer;