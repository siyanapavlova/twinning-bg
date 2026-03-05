import {GeoJsonLayer } from "deck.gl";
import type { FeatureCollection, Geometry } from 'geojson';

interface Props {
    data: FeatureCollection<Geometry>,
}

const createCountriesLayer = ({data}: Props) => 
    data && new GeoJsonLayer({
        id: "arcs",
        data: data,
        stroked: false,
            filled: true,
            pickable: true,
            getFillColor: [160, 160, 180, 200],
    });

export default createCountriesLayer;