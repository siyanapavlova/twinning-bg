import type { CountryFeature, CountryFeatureWithId, CountryProperties } from "@/types";
import {GeoJsonLayer } from "deck.gl";
import type { FeatureCollection, Geometry } from 'geojson';


interface Props {
  data: FeatureCollection<Geometry, CountryProperties>;
  relationNumberPerCountry: { [k: string]: number };
  countryColours: { [k: string]: [number, number, number]}
  selectedCountry: string | null;
  hoveredCountry: string | null;
  showCountries: boolean,
  onClick: (country: CountryFeatureWithId) => void;
  onHover: (country: CountryFeature | null) => void;
}


// const normalize = (value: number) =>
//   (value - minCount) / (maxCount - minCount);

// const colorScale = (t: number): [number, number, number] => {
//   const v = Math.round(255 * (1 - t));
//   return [v, v, v];
// }

const createCountriesLayer = ({data, relationNumberPerCountry, countryColours, selectedCountry, hoveredCountry, showCountries, onClick, onHover}: Props) => {

  return new GeoJsonLayer<CountryProperties>({
        id: "countries",
        data: data,
        stroked: true,
        filled: true,
        pickable: true,

        // getFillColor: [160, 160, 180, 200],
        getFillColor: (country) => {
          if (country.properties.name === selectedCountry) return [247, 200, 96];
          if (country.properties.name === hoveredCountry) return [240, 240, 200];
          if (!showCountries && relationNumberPerCountry[country.properties.name]) return [200, 200, 220];
          if (relationNumberPerCountry[country.properties.name]) return countryColours[country.properties.name];
          return [230, 230, 250];
        },

        updateTriggers: {
          getFillColor: [selectedCountry, hoveredCountry, showCountries]
        },

        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        lineWidthUnits: "pixels",

        onHover: info => {
          if (info.object) {
            const name = info.object?.properties.name;

            if (!name || !relationNumberPerCountry[name]) {
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

          if (!name || !relationNumberPerCountry[name]) {
            return; // ignore
          }

          onClick(info.object);
        },
        transitions: {
          getFillColor: 100,
        }
    })};

export default createCountriesLayer;