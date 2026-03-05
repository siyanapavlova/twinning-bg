import type { FeatureCollection, Geometry } from 'geojson';
import rawCountries from './countries.json';
import type { CountryProperties } from '../layers/CountriesLayer';

const countries = rawCountries as FeatureCollection<Geometry, CountryProperties>;

export default countries;