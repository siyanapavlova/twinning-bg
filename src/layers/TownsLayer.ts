import { ScatterplotLayer } from "deck.gl";
import type { Town } from "../components/TwinTownsMap";


interface Props {
    data: Town[],
    onClick: (town: Town) => void;
}

const createTownsLayer = ({data, onClick}: Props) => 
    new ScatterplotLayer({
        id: "towns",
        data,
        pickable: true,
        getPosition: (t) => t.coordinates,
        getRadius: 50000,
        radiusMaxPixels: 4,
        getFillColor: [100, 100, 100],
        onClick: (info) => {
          if (info.object) {
            onClick(info.object);
          }
        },
    })


export default createTownsLayer;