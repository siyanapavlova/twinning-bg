import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import towns from "../data/towns";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";
import arcs from "../data/twinning";
import { useCallback, useMemo, useState } from "react";

interface Town {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
}

interface Country {
  id: string;
  name: string;
}

interface Arc {
  from: string;
  to: string;
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 10,
  latitude: 47,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

const TwinTownsMap = () => {
  // const [selected, setSelected] = useState<Town | Country | null>(null);
  const [selected, setSelected] = useState<string>();
  const [visibleArcs, setVisibleArcs] = useState<Arc[]>([]);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  const onReset = useCallback(() => setViewState(INITIAL_VIEW_STATE), []);

  const townIndex = useMemo(
    () => Object.fromEntries(towns.map((t) => [t.id, t])),
    [towns],
  );

  const updateVisible = (info: string) => {
    setSelected(info);
    setVisibleArcs(arcs.filter((a) => a.from === info || a.to === info));
  };

  const layers = useMemo(
    () => [
      new ScatterplotLayer({
        id: "towns",
        data: towns,
        pickable: true,
        getPosition: (t) => t.coordinates,
        getRadius: 50000,
        radiusMaxPixels: 4,
        getFillColor: [100, 100, 100],
        onClick: (info) => {
          if (info.object) {
            updateVisible(info.object.id);
            setViewState((v) => ({
              ...v,
              longitude: info.object.coordinates[0],
              latitude: info.object.coordinates[1],
              zoom: 3,
              transitionDuration: 800,
            }));
          }
        },
      }),
      new ArcLayer<Arc>({
        id: "arcs",
        data: visibleArcs,
        getSourcePosition: (d: Arc) =>
          townIndex[d.from].coordinates as [number, number],
        getTargetPosition: (d: Arc) =>
          townIndex[d.to].coordinates as [number, number],
        // getWidth: () => 2 + Math.sin(time) * 1.5,
        getSourceColor: [23, 20, 201],
        getTargetColor: [227, 186, 20],
        greatCircle: true,
      }),
    ],
    [visibleArcs, townIndex],
  );

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      viewState={viewState}
      onViewStateChange={({ viewState }) => {
        if ("longitude" in viewState) {
          setViewState(viewState);
        }
      }}
      controller
      layers={layers}
    >
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      ></Map>
    </DeckGL>
  );
};

export default TwinTownsMap;
