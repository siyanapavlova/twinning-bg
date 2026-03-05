import type { FeatureCollection, Geometry } from 'geojson';
import rawCountries from './countries.json';

const countries = rawCountries as FeatureCollection<Geometry>;

export default countries;