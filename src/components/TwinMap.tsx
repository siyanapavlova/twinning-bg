import { DeckGL } from "@deck.gl/react";
import { type MapViewState } from "@deck.gl/core";
import towns from "../data/towns";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 90,
  latitude: 20,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};

const TwinMap = () => {
  const layers = [
    new ScatterplotLayer({
      id: "towns",
      data: towns,
      getPosition: (t) => t.coordinates,
      getRadius: 50000,
      radiusMaxPixels: 4,
      getFillColor: [100, 100, 100],
    }),
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      ></Map>
    </DeckGL>
  );
};

export default TwinMap;
