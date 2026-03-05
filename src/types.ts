
import type { Geometry, Feature } from 'geojson';

export interface CountryProperties {
  id: string;
  name: string;
  coordinates: number[],
}

export type CountryFeature =
  Feature<Geometry, CountryProperties>;

export type CountryFeatureWithId =
  Feature<Geometry, CountryProperties> & { id: string };

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