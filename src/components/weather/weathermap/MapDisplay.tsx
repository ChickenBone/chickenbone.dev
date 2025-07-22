import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import React from 'react';

interface MapDisplayProps {
    mapRef: React.MutableRefObject<L.Map | null>;
    children?: React.ReactNode;
}

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

function BasemapLayer({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();
    useEffect(() => {
        mapRef.current = map;
        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
        });
        tileLayer.addTo(map);
        return () => {
            map.removeLayer(tileLayer);
        };
    }, [map, mapRef]);
    return null;
}

export function MapDisplay({ mapRef, children }: MapDisplayProps) {
    return (
        <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
            zoomControl={false}
        >
            <BasemapLayer mapRef={mapRef} />
            {children}
        </MapContainer>
    );
}
