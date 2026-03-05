import type { FeatureCollection, Geometry } from 'geojson';
import rawCountries from './countriesMediumDetail.json';
import type { CountryProperties } from '@/types';

const countries = rawCountries as FeatureCollection<Geometry, CountryProperties>;

export default countries;