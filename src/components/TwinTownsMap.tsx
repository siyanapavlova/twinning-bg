import { DeckGL } from "@deck.gl/react";
import { type MapViewState } from "@deck.gl/core";
import towns from "../data/towns";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";
import arcs from "../data/twinning";
import { useMemo, useState } from "react";

interface Town {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
}

interface Country {
  id: string;
  name: string;
}

interface Arc {
  from: string;
  to: string;
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 10,
  latitude: 47,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

const TwinTownsMap = () => {
  // const [selected, setSelected] = useState<Town | Country | null>(null);
  const [selected, setSelected] = useState<string>();
  const [visibleArcs, setVisibleArcs] = useState<Arc[]>([]);
  // const [visibleArcs, setVisibleArcs] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 10,
    latitude: 50,
    zoom: 4,
    pitch: 0,
    bearing: 0,
  });

  // console.log(visibleArcs);

  // const visibleArcs = useMemo(() => {
  //   if (!selected) return [];

  //   return arcs.filter((a) => {
  //     a.from === selected || a.to === selected;
  //   });
  // }, [arcs, selected]);

  const townIndex = useMemo(
    () => Object.fromEntries(towns.map((t) => [t.id, t])),
    [towns],
  );

  // console.log(townIndex);

  // const getTown = ()

  const updateVisible = (info: string) => {
    console.log(info);
    setSelected(info);
    console.log(visibleArcs);
    console.log(
      arcs.filter((a) => {
        a.from === info || a.to === info;
      }),
    );
    setVisibleArcs(
      arcs.filter((a) => {
        a.from === info || a.to === info;
      }),
    );
    console.log(visibleArcs);
  };

  const layers = [
    new ScatterplotLayer({
      id: "towns",
      data: towns,
      pickable: true,
      getPosition: (t) => t.coordinates,
      getRadius: 50000,
      radiusMaxPixels: 4,
      getFillColor: [100, 100, 100],
      onClick: (info) => {
        console.log(info);
        if (info.object) {
          updateVisible(info.object.id);
          setViewState((v) => ({
            ...v,
            longitude: info.object.coordinates[0],
            latitude: info.object.coordinates[1],
            zoom: 4,
            transitionDuration: 800,
          }));
        }
        // setSelected(info.object.id);
        // if (info.object) {
        // updateVisible(info);
        // }
        //   setSelected(info.object.id);
        //   console.log(selected);
        //   console.log(
        //     arcs.filter((a) => {
        //       a.from === info.object.id || a.to === info.object.id;
        //     }),
        //   );
        //   console.log(info.object.id);
        //   console.log(visibleArcs);
        // }
      },
    }),
    new ArcLayer<Arc>({
      id: "arcs",
      data: arcs,
      getSourcePosition: (d: Arc) =>
        townIndex[d.from].coordinates as [number, number],
      getTargetPosition: (d: Arc) =>
        townIndex[d.to].coordinates as [number, number],
      // getWidth: () => 2 + Math.sin(time) * 1.5,
      getSourceColor: [255, 120, 120],
      getTargetColor: [120, 120, 255],
      greatCircle: true,
    }),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      viewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      controller
      layers={layers}
    >
      <Map
        id="map"
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      ></Map>
    </DeckGL>
  );
};

export default TwinTownsMap;
