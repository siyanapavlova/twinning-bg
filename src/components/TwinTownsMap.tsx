import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import rawTowns from "../data/towns";
import arcs from "../data/twinning";
import { useMemo, useState } from "react";
import createTownsLayer from "../layers/TownsLayer";
import createTwinningLayer from "../layers/TwinningLayer";
import countries from "../data/countries.ts";
import createCountriesLayer, {
  type CountryFeature,
  type CountryFeatureWithId,
} from "../layers/CountriesLayer.ts";
import Legend from "./Legend.tsx";
import countryCounts from "../data/countryCounts.ts";

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  pointerEvents: "none",
};

const tealScale = (t: number): [number, number, number] => {
  // const min = [220, 240, 240]; // old
  // const min = [200, 220, 220]; // newer
  const min = [210, 230, 230];
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
  const [selectedTown, setSelectedTown] = useState<string | null>(null);
  const [hoveredTown, setHoveredTown] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [visibleArcs, setVisibleArcs] = useState<Arc[]>([]);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hoveredArc, setHoveredArc] = useState<Arc | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // to stop dragging on click of town
  // const [dragBlocked, setDragBlocked] = useState(false);

  // const onReset = useCallback(() => setViewState(INITIAL_VIEW_STATE), []);

  const townIndex = useMemo(
    () => Object.fromEntries(towns.map((t) => [t.id, t])),
    [towns],
  );

  const updateVisible = (townID: string) => {
    setSelectedTown(townID);
    setSelectedCountry(null);
    setVisibleArcs(arcs.filter((a) => a.from === townID || a.to === townID));
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
        hoveredCountry: hoveredCountry,
        colorScale: tealScale,
        onClick: (country: CountryFeatureWithId) => {
          updateVisibleByCountry(country.id);
          setSelectedCountry(country.properties.name);
          setSelectedTown(null);
        },
        onHover: (country: CountryFeature | null) => {
          setHoveredCountry(country?.properties.name ?? null);
        },
      }),

      createTownsLayer({
        data: towns,
        hoveredTown: hoveredTown,
        selectedTown: selectedTown,
        onClick: (town) => {
          updateVisible(town.id);
          // setDragBlocked(true); // block drag during click
          // setViewState((v) => ({
          //   ...v,
          //   longitude: town.coordinates[0],
          //   latitude: town.coordinates[1],
          //   zoom: 3,
          //   transitionDuration: 800,
          // }));
        },
        onHover: (town: Town | null) => {
          setHoveredTown(town?.name ?? null);
          // setDragBlocked(Boolean(town)); // block drag while pointer is over a town
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
    [
      countries,
      selectedCountry,
      visibleArcs,
      townIndex,
      hoveredArc,
      hoveredCountry,
      hoveredTown,
      selectedTown,
    ],
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
        // controller={{
        //   dragPan: !dragBlocked, // disable dragging when hovering/clicking a town
        //   dragRotate: true,
        // }}
        // onInteractionStateChange={({ isDragging }) => {
        //   if (!isDragging) setDragBlocked(false); // allow drag again
        // }}
        layers={layers}
        getTooltip={({ object }) => {
          if (!object) return null;
          if (object.name) return object.name;
          if (object.properties && object.properties.name) {
            const name = object.properties.name;
            if (countryCounts[name])
              return {
                html: `<b>${name}</b><br />Twins: ${countryCounts[name]}`,
                style: tooltipStyle,
              };
            else
              return {
                html: `<b>${name}</b><br>No twins`,
                style: tooltipStyle,
              };
          }
          if (object.from)
            return {
              html: `<b>BG town</b>: ${object.from}<br /><b>Twin town</b>: ${object.to}`,
              style: tooltipStyle,
            };
          return null;
        }}
        onClick={(info) => {
          if (!info.object || !countryCounts[info.object.properties.name]) {
            setSelectedCountry(null);
            setVisibleArcs([]);
          }
        }}
      ></DeckGL>
      <Legend min={1} max={140} ticks={4} colorScale={tealScale} />
    </>
  );
};

export default TwinTownsMap;
