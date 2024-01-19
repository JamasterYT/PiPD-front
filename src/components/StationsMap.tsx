// @ts-nocheck
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Station } from "./ComponentA";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// Wymagane przy użyciu Leaflet w wersji 1.2.x i wyższej: poprawka ikony markera

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const StationsMap = ({ stations }: { stations: Station[] }) => {
  // Przykładowa pozycja początkowa mapy - centrum Polski
  const defaultPosition: L.LatLngTuple = [51.9194, 19.1451];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={6}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[parseFloat(station.gegrLat), parseFloat(station.gegrLon)]}
        >
          <Popup>
            {station.stationName}
            <br />
            {station.city && station.city.name}
            <br />
            {station.addressStreet}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default StationsMap;
