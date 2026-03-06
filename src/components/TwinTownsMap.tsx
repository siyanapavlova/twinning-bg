import { DeckGL } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import rawTowns from "../data/towns";
import arcs from "../data/twinning";
import { useMemo, useState } from "react";
import createTownsLayer from "../layers/TownsLayer";
import createTwinningLayer from "../layers/TwinningLayer";
import countries from "../data/countries.ts";
import createCountriesLayer from "../layers/CountriesLayer.ts";
import type {
  CountryFeature,
  CountryFeatureWithId,
  Town,
  Arc,
} from "@/types.ts";
import Legend from "./Legend.tsx";
import twinning from "../data/twinning";
import DisplaySelection from "./DisplaySelection.tsx";
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

const relationNumberPerCountry = twinning
  .map((t) => townIndex[t.to].country)
  .reduce(
    (occurences, item) => {
      occurences[item] = (occurences[item] || 0) + 1;
      return occurences;
    },
    {} as { [k: string]: number },
  );

const townNumberPerCountry = towns
  .map((t) => t.country)
  .reduce(
    (occurences, item) => {
      occurences[item] = (occurences[item] || 0) + 1;
      return occurences;
    },
    {} as { [k: string]: number },
  );

delete townNumberPerCountry["Bulgaria"];

const minTwins = Math.min.apply(null, Object.values(relationNumberPerCountry));
const maxTwins = Math.max.apply(null, Object.values(relationNumberPerCountry));

const logNormalize = (value: number): number => {
  // Safety check
  if (value <= 0) return 0;

  const logMin = Math.log(minTwins);
  const logMax = Math.log(maxTwins);
  const logValue = Math.log(value);

  return (logValue - logMin) / (logMax - logMin);
};

const countryColours = Object.entries(relationNumberPerCountry).reduce(
  (p, [k, v]) => ({
    ...p,
    [k]: tealScale(logNormalize(v)),
  }),
  {} as { [k: string]: [number, number, number] },
);

const TwinTownsMap = () => {
  // const [selected, setSelected] = useState<Town | Country | null>(null);
  const [selectedTown, setSelectedTown] = useState<string | null>(null);
  const [hoveredTown, setHoveredTown] = useState<string | null>(null);
  const [activeTowns, setActiveTowns] = useState<Town[]>([]);
  const [allTownsActive, setAllTownsActive] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [visibleArcs, setVisibleArcs] = useState<Arc[]>([]);
  const [selectedArc, setSelectedArc] = useState<Arc | null>(null);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hoveredArc, setHoveredArc] = useState<Arc | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [townSelection, setTownSelection] = useState<boolean>(false);
  const [countrySelection, setCountrySelection] = useState<boolean>(false);
  const [arcSelection, setArcSelection] = useState<boolean>(false);
  const [showAllTowns, setShowAllTowns] = useState<boolean>(false);
  const [showCountries, setShowCountries] = useState<boolean>(true);

  // const [fontReady, setFontReady] = useState<boolean>(false);

  // useEffect(() => {
  //   document.fonts.load('12px "RobotoDeckGL"').then(() => {
  //     setFontReady(true);
  //   });
  // }, []);

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
        relationNumberPerCountry: relationNumberPerCountry,
        countryColours: countryColours,
        selectedCountry: selectedCountry ? selectedCountry : "",
        hoveredCountry: hoveredCountry,
        showCountries: showCountries,
        onClick: (country: CountryFeatureWithId) => {
          updateVisibleByCountry(country.properties.name);
          setSelectedCountry(country.properties.name);
          setSelectedTown(null);
          setSelectedArc(null);
          setCountrySelection(true);
          setTownSelection(false);
          setArcSelection(false);
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
        arcSelection: arcSelection,
        showAllTowns: showAllTowns,
        zoom: viewState.zoom,
        // fontReady: fontReady,
        onClick: (town) => {
          updateVisible(town.id);
          setTownSelection(true);
          setCountrySelection(false);
          setArcSelection(false);
          setSelectedArc(null);
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
        selectedArc: selectedArc,
        onHover: (arc: Arc | null) => {
          setHoveredArc(arc);
        },
        onClick: (arc: Arc) => {
          setSelectedArc(arc);
          setTownSelection(false);
          setCountrySelection(false);
          setVisibleArcs([arc]);
          setSelectedCountry(null);
          setSelectedTown(null);
          setActiveTowns([townIndex[arc.to], townIndex[arc.from]]);
          setArcSelection(true);
        },
      }),
    ],
    [
      // countries,
      selectedCountry,
      visibleArcs,
      hoveredArc,
      hoveredCountry,
      hoveredTown,
      selectedTown,
      activeTowns,
      allTownsActive,
      showAllTowns,
      showCountries,
      selectedArc,
      arcSelection,
      viewState.zoom,
      // fontReady,
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
            if (relationNumberPerCountry[name])
              return {
                html: `<b>${name}</b><br />Towns: ${townNumberPerCountry[name]}<br />Relations: ${relationNumberPerCountry[name]}`,
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
              !relationNumberPerCountry[info.object.properties.name])
          ) {
            setSelectedCountry(null);
            setSelectedTown(null);
            setSelectedArc(null);
            setVisibleArcs([]);
            setActiveTowns([]);
            setAllTownsActive(true);
            setTownSelection(false);
            setCountrySelection(false);
            setArcSelection(false);
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
      {showCountries && (
        <Legend
          min={minTwins}
          max={maxTwins}
          ticks={4}
          colorScale={tealScale}
        />
      )}
    </>
  );
};

export default TwinTownsMap;
