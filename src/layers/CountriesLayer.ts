import {GeoJsonLayer } from "deck.gl";
import type { FeatureCollection, Geometry, Feature } from 'geojson';
import countryCounts from "../data/countryCounts";

export interface CountryProperties {
  id: string;
  name: string;
  coordinates: number[],
}

export type CountryFeature =
  Feature<Geometry, CountryProperties>;

export type CountryFeatureWithId =
  Feature<Geometry, CountryProperties> & { id: string };

interface Props {
  data: FeatureCollection<Geometry, CountryProperties>;
  selectedCountry: string | null;
  hoveredCountry: string | null;
  onClick: (country: CountryFeatureWithId) => void;
  onHover: (country: CountryFeature | null) => void;
  colorScale: (t: number) => [number, number, number];
}

const counts = Object.values(countryCounts);
const minCount = Math.min(...counts);
const maxCount = Math.max(...counts);

// const normalize = (value: number) =>
//   (value - minCount) / (maxCount - minCount);

const logNormalize = (value: number): number => {
  // Safety check
  if (value <= 0) return 0;

  const logMin = Math.log(minCount);
  const logMax = Math.log(maxCount);
  const logValue = Math.log(value);

  return (logValue - logMin) / (logMax - logMin);
};

// const colorScale = (t: number): [number, number, number] => {
//   const v = Math.round(255 * (1 - t));
//   return [v, v, v];
// }

const createCountriesLayer = ({data, selectedCountry, hoveredCountry, colorScale, onClick, onHover}: Props) =>
    new GeoJsonLayer<CountryProperties>({
        id: "countries",
        data: data,
        stroked: true,
        filled: true,
        pickable: true,

        // getFillColor: [160, 160, 180, 200],
        getFillColor: (country) => {
          if (country.properties.name === selectedCountry) return [247, 200, 96];
          if (country.properties.name === hoveredCountry) return [240, 240, 200];
          if (countryCounts[country.properties.name]) {
            const count = countryCounts[country.properties.name];
            return colorScale(logNormalize(count));
          }
          return [230, 230, 250];
        },

        updateTriggers: {
          getFillColor: [selectedCountry, hoveredCountry]
        },

        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        lineWidthUnits: "pixels",

        onHover: info => {
          if (info.object) {
            const name = info.object?.properties.name;

            if (!name || !countryCounts[name]) {
              onHover(null);
              return;
            }

            onHover(info.object);
          } else {
            onHover(null);
          }
        },

        onClick: (info) => {
          const name = info.object?.properties.name;

          if (!name || !countryCounts[name]) {
            return; // ignore
          }

          onClick(info.object);
        },
    });

export default createCountriesLayer;