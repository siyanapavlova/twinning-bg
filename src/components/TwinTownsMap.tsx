import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import rawTowns from "../data/towns";
import arcs from "../data/twinning";
import { useCallback, useMemo, useState } from "react";
import createTownsLayer from "../layers/TownsLayer";
import createTwinningLayer from "../layers/TwinningLayer";
import countries from "../data/countries.ts";
import createCountriesLayer, {
  type CountryFeature,
} from "../layers/CountriesLayer.ts";
import Legend from "./Legend.tsx";

const tealScale = (t: number): [number, number, number] => {
  // const min = [220, 240, 240]; // old
  const min = [200, 220, 220];
  const max = [0, 120, 120];

  return [
    Math.round(min[0] + t * (max[0] - min[0])),
    Math.round(min[1] + t * (max[1] - min[1])),
    Math.round(min[2] + t * (max[2] - min[2])),
  ];
};

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
  zoom: 2,
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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [visibleArcs, setVisibleArcs] = useState<Arc[]>([]);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hoveredArc, setHoveredArc] = useState<Arc | null>(null);

  const onReset = useCallback(() => setViewState(INITIAL_VIEW_STATE), []);

  const townIndex = useMemo(
    () => Object.fromEntries(towns.map((t) => [t.id, t])),
    [towns],
  );

  const updateVisible = (info: string) => {
    setSelected(info);
    setVisibleArcs(arcs.filter((a) => a.from === info || a.to === info));
  };

  const updateVisibleByCountry = (info: string) => {
    const townsFromCountry = towns
      .filter((t) => t.country === info)
      .map((t) => t.id);
    const visibleArcs = arcs.filter(
      (a) =>
        townsFromCountry.includes(a.from) || townsFromCountry.includes(a.to),
    );
    setVisibleArcs(visibleArcs);
  };

  const layers = useMemo(
    () => [
      createCountriesLayer({
        data: countries,
        selectedCountry: selectedCountry ? selectedCountry : "",
        colorScale: tealScale,
        onClick: (country: CountryFeature) => {
          updateVisibleByCountry(country.id);
          setSelectedCountry(country.properties.name);
        },
      }),

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
        hoveredArc: hoveredArc,
        onHover: (arc: Arc | null) => {
          setHoveredArc(arc);
        },
      }),
    ],
    [countries, selectedCountry, visibleArcs, townIndex, hoveredArc],
  );

  return (
    <>
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
      <Legend min={1} max={140} ticks={4} colorScale={tealScale} />
    </>
  );
};

export default TwinTownsMap;
