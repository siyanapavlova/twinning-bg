import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import rawTowns from "../data/towns";
import arcs from "../data/twinning";
import { useEffect, useMemo, useState } from "react";
import createTownsLayer from "../layers/TownsLayer";
import createTwinningLayer from "../layers/TwinningLayer";
import countries from "../data/countries.ts";
import createCountriesLayer, {
  type CountryFeature,
  type CountryFeatureWithId,
} from "../layers/CountriesLayer.ts";
import Legend from "./Legend.tsx";
import twinning from "../data/twinning";
import DisplaySelection from "./DisplaySelection.tsx";
// import countryCounts from "../data/countryCounts.ts";
// import { Map } from "react-map-gl/maplibre";

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  pointerEvents: "none",
  top: "12px",
  left: "12px",
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

const towns: Town[] = rawTowns.map((t) => ({
  ...t,
  coordinates: [t.coordinates[0], t.coordinates[1]],
}));

const townIndex = Object.fromEntries(towns.map((t) => [t.id, t]));

const countryCountByRelationNumber = twinning
  .map((t) => townIndex[t.to].country)
  .reduce(
    (occurences, item) => {
      occurences[item] = (occurences[item] || 0) + 1;
      return occurences;
    },
    {} as { [k: string]: number },
  );

// console.log(countryCountByRelationNumber);

// const countryCounts = towns
//   .map((t) => t.country)
//   .reduce(
//     (occurences, item) => {
//       occurences[item] = (occurences[item] || 0) + 1;
//       return occurences;
//     },
//     {} as { [k: string]: number },
//   );

const countryCounts = countryCountByRelationNumber;

const minTwins = Math.min.apply(null, Object.values(countryCounts));
const maxTwins = Math.max.apply(null, Object.values(countryCounts));

const TwinTownsMap = () => {
  // const [selected, setSelected] = useState<Town | Country | null>(null);
  const [selectedTown, setSelectedTown] = useState<string | null>(null);
  const [hoveredTown, setHoveredTown] = useState<string | null>(null);
  const [activeTowns, setActiveTowns] = useState<Town[]>([]);
  const [allTownsActive, setAllTownsActive] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [visibleArcs, setVisibleArcs] = useState<Arc[]>([]);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hoveredArc, setHoveredArc] = useState<Arc | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [townSelection, setTownSelection] = useState<boolean>(false);
  const [countrySelection, setCountrySelection] = useState<boolean>(false);
  const [showAllTowns, setShowAllTowns] = useState<boolean>(false);
  const [showCountries, setShowCountries] = useState<boolean>(true);

  const [fontReady, setFontReady] = useState<boolean>(false);

  useEffect(() => {
    document.fonts.load('12px "RobotoDeckGL"').then(() => {
      setFontReady(true);
    });
  }, []);

  const updateVisible = (townID: string) => {
    const visibleArcs = arcs.filter(
      (a) => a.from === townID || a.to === townID,
    );
    const activeTowns = visibleArcs
      .map((a) => [townIndex[a.to], townIndex[a.from]])
      .flat();

    setSelectedTown(townID);
    setSelectedCountry(null);
    setAllTownsActive(false);
    setActiveTowns([...activeTowns, townIndex[townID]]);
    setVisibleArcs(visibleArcs);
  };

  const updateVisibleByCountry = (info: string) => {
    const townsFromCountry = towns
      .filter((t) => t.country === info)
      .map((t) => t.id);

    const visibleArcs = arcs.filter(
      (a) =>
        townsFromCountry.includes(a.from) || townsFromCountry.includes(a.to),
    );

    const activeTowns = visibleArcs
      .map((a) => [townIndex[a.to], townIndex[a.from]])
      .flat();

    setVisibleArcs(visibleArcs);
    setAllTownsActive(false);
    setActiveTowns(activeTowns);
  };

  const layers = useMemo(
    () => [
      createCountriesLayer({
        data: countries,
        countryCounts: countryCounts,
        minCount: minTwins,
        maxCount: maxTwins,
        selectedCountry: selectedCountry ? selectedCountry : "",
        hoveredCountry: hoveredCountry,
        colorScale: tealScale,
        onClick: (country: CountryFeatureWithId) => {
          updateVisibleByCountry(country.properties.name);
          setSelectedCountry(country.properties.name);
          setSelectedTown(null);
          setCountrySelection(true);
          setTownSelection(false);
        },
        onHover: (country: CountryFeature | null) => {
          setHoveredCountry(country?.properties.name ?? null);
        },
      }),

      createTownsLayer({
        data: towns,
        activeTowns: activeTowns,
        allTownsActive: allTownsActive,
        hoveredTown: hoveredTown,
        selectedTown: selectedTown,
        townSelection: townSelection,
        countrySelection: countrySelection,
        showAllTowns: showAllTowns,
        zoom: viewState.zoom,
        fontReady: fontReady,
        onClick: (town) => {
          updateVisible(town.id);
          setTownSelection(true);
          setCountrySelection(false);
          // setViewState((v) => ({
          //   ...v,
          //   longitude: town.coordinates[0],
          //   latitude: town.coordinates[1],
          //   zoom: 3,
          //   transitionDuration: 800,
          // }));
        },
        onHover: (town: Town | null) => {
          setHoveredTown(town?.id ?? null);
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
      activeTowns,
      allTownsActive,
      showAllTowns,
      viewState.zoom,
      fontReady,
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
        layers={layers}
        pickingRadius={10}
        getTooltip={({ object }) => {
          if (!object) return null;
          if (object.name && object.country)
            return {
              html: `<b>${object.name}</b>,  ${object.country}`,
              style: tooltipStyle,
            };
          if (object.properties && object.properties.name) {
            const name = object.properties.name;
            if (countryCounts[name])
              return {
                html: `<b>${name}</b><br />Twin relations: ${countryCounts[name]}`,
                style: tooltipStyle,
              };
            else
              return {
                html: `<b>${name}</b><br>No twin relations`,
                style: tooltipStyle,
              };
          }
          if (object.from)
            return {
              html: `<b>BG town</b>: ${object.from}<br /><b>Twin town</b>: ${townIndex[object.to].name}<br /><b>Twin country</b>: ${townIndex[object.to].country}`,
              style: tooltipStyle,
            };
          return null;
        }}
        onClick={(info) => {
          if (
            !info.object ||
            (info.object &&
              info.object.properties &&
              !countryCounts[info.object.properties.name])
          ) {
            setSelectedCountry(null);
            setSelectedTown(null);
            setVisibleArcs([]);
            setActiveTowns([]);
            setAllTownsActive(true);
            setTownSelection(false);
            setCountrySelection(false);
          }
        }}
      >
        {/* <Map
          id="map"
          initialViewState={INITIAL_VIEW_STATE}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        ></Map> */}
      </DeckGL>
      <DisplaySelection
        onChangeTownSelection={(checked) => setShowAllTowns(checked)}
        onChangeCountrySelection={(checked) => setShowCountries(checked)}
      ></DisplaySelection>
      <Legend min={minTwins} max={maxTwins} ticks={4} colorScale={tealScale} />
    </>
  );
};

export default TwinTownsMap;
