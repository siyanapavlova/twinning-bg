import {GeoJsonLayer } from "deck.gl";
import type { FeatureCollection, Geometry, Feature } from 'geojson';

export interface CountryProperties {
  id: string;
  name: string;
  coordinates: number[]
}

export type CountryFeature =
  Feature<Geometry, CountryProperties>;

interface Props {
  data: FeatureCollection<Geometry, CountryProperties>;
  onClick: (country: CountryFeature) => void;
}

const createCountriesLayer = ({data, onClick}: Props) => 
    new GeoJsonLayer<CountryFeature>({
        id: "arcs",
        data: data,
        stroked: false,
        filled: true,
        pickable: true,
        getFillColor: [160, 160, 180, 200],
        onClick: (info) => {
          if (info.object) {
            onClick(info.object);
          }
        },
    });

export default createCountriesLayer;