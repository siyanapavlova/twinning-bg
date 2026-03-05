import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import "./map.css";
import { Map } from "react-map-gl/maplibre";
import type { ViewState } from "react-map-gl/maplibre";

// Values and types.
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";

// Types only.
import type { DeckGLRef } from "@deck.gl/react";
import type { GeoJsonLayerProps } from "@deck.gl/layers";

const INITIAL_VIEW_STATE: ViewState = {
  longitude: 90,
  latitude: 20,
  zoom: 2,
  pitch: 0,
  bearing: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const TwinMap = () => {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        // top: 0,
        // left: 0,
        // background: "linear-gradient(0, #000, #223)",
      }}
    >
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      ></Map>
    </div>
  );
};

export default TwinMap;
