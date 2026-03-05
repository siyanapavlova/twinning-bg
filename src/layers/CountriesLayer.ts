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
}

const counts = Object.values(countryCounts);
const minCount = Math.min(...counts);
const maxCount = Math.max(...counts);

const normalize = (value: number) =>
  (value - minCount) / (maxCount - minCount);

const logNormalize = (value: number): number => {
  // Safety check
  if (value <= 0) return 0;

  const logMin = Math.log(minCount);
  const logMax = Math.log(maxCount);
  const logValue = Math.log(value);

  return (logValue - logMin) / (logMax - logMin);
};

const colorScale = (t: number): [number, number, number] => {
  const v = Math.round(255 * (1 - t));
  return [v, v, v];
}

const tealScale = (t: number): [number, number, number] => {
  const min = [220, 240, 240];
  const max = [0, 120, 120];

  return [
    Math.round(min[0] + t * (max[0] - min[0])),
    Math.round(min[1] + t * (max[1] - min[1])),
    Math.round(min[2] + t * (max[2] - min[2])),
  ];
};

const createCountriesLayer = ({data, selectedCountry, onClick}: Props) =>
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
            return tealScale(logNormalize(count));
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
        highlightColor: [240, 240, 150],

        onClick: (info) => {
          if (info.object) {
            onClick(info.object);
          }
        },
    });

export default createCountriesLayer;