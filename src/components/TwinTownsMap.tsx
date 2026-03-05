import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import rawTowns from "../data/towns";
import { Map } from "react-map-gl/maplibre";
import arcs from "../data/twinning";
import { useCallback, useMemo, useState } from "react";
import createTownsLayer from "../layers/TownsLayer";
import createTwinningLayer from "../layers/TwinningLayer";
import { GeoJsonLayer } from "deck.gl";
import countries from "../data/countries.ts";
import createCountriesLayer from "../layers/CountriesLayer.ts";

export interface Town {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
}

export interface Country {
  id: string;
  name: string;
}

export interface Arc {
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

// to ensure towns.coodinates is typed correctly
// because otherwise the import assumes a type based on the data
// and infers coordinates to be numbers[], but that causes issues later
// in the Arcs layer because its getSourcePosition prop expects something
// that is explicitly typed as [number, number]
const towns: Town[] = rawTowns.map((t) => ({
  ...t,
  coordinates: [t.coordinates[0], t.coordinates[1]],
}));

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
      createCountriesLayer({ data: countries }),

      createTownsLayer({
        data: towns,
        onClick: (town) => {
          updateVisible(town.id);
          setViewState((v) => ({
            ...v,
            longitude: town.coordinates[0],
            latitude: town.coordinates[1],
            zoom: 3,
            transitionDuration: 800,
          }));
        },
      }),

      createTwinningLayer({
        data: visibleArcs,
        townIndex: townIndex,
      }),
    ],
    [countries, visibleArcs, townIndex],
  );

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={({ viewState }) => {
        if ("longitude" in viewState) {
          setViewState(viewState);
        }
      }}
      controller
      layers={layers}
      getTooltip={({ object }) => object?.name}
    >
      {/* <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      ></Map> */}
    </DeckGL>
  );
};

export default TwinTownsMap;
