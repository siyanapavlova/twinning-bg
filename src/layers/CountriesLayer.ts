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

interface Props {
  data: FeatureCollection<Geometry, CountryProperties>;
  selectedCountry: string;
  onClick: (country: CountryFeature) => void;
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

const createCountriesLayer = ({data, selectedCountry, colorScale, onClick}: Props) =>
    new GeoJsonLayer<CountryProperties>({
        id: "countries",
        data: data,
        stroked: true,
        filled: true,
        pickable: true,

        // getFillColor: [160, 160, 180, 200],
        getFillColor: (country) => {
          if (country.properties.name === selectedCountry) return [255, 255, 150];
          if (countryCounts[country.properties.name]) {
            const count = countryCounts[country.properties.name];
            return colorScale(logNormalize(count));
          }
          return [230, 230, 250];
        },

        updateTriggers: {
          getFillColor: selectedCountry,
        },

        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        lineWidthUnits: "pixels",
        autoHighlight: true,
        highlightColor: [240, 240, 200],

        onClick: (info) => {
          if (info.object) {
            onClick(info.object);
          }
        },
    });

export default createCountriesLayer;