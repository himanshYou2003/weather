"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapProps {
  mapCenter: [number, number];
}

export default function Map({ mapCenter }: MapProps) {
  // Ensure the map re-renders correctly when the mapCenter changes
  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      className="absolute bottom-5 right-5 w-1/5 h-1/3 z-10 border rounded-md"
      key={mapCenter.join('-')} // Force re-render when mapCenter changes
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={mapCenter}>
        <Popup>
          Current Location
        </Popup>
      </Marker>
    </MapContainer>
  );
}
