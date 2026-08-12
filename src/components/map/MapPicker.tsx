import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
}

const customPickerIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#4F46E5" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
    </svg>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
});

function MapEventsHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  lat,
  lng,
  onLocationChange,
  height = '350px',
}) => {
  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const pos = marker.getLatLng();
          onLocationChange(pos.lat, pos.lng);
        }
      },
    }),
    [onLocationChange]
  );

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler onLocationChange={onLocationChange} />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={[lat, lng]}
          icon={customPickerIcon}
        />
      </MapContainer>
    </div>
  );
};
