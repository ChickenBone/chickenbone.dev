import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import React from 'react';

interface MapDisplayProps {
    mapRef: React.MutableRefObject<L.Map | null>;
    children?: React.ReactNode;
}

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useTheme as useNextTheme } from 'next-themes';

function BasemapLayer({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();
    const { resolvedTheme } = useNextTheme();

    useEffect(() => {
        mapRef.current = map;

        // Choose tile URL according to resolved theme (fallback to light)
        const themeMode = resolvedTheme || 'light';
        const tileUrl = themeMode === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        const tileLayer = L.tileLayer(tileUrl, {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
        });

        // Attach layer and store reference on the map for potential future updates
        tileLayer.addTo(map);
        ;(map as any).__basemapLayer = tileLayer;

        return () => {
            try {
                if ((map as any).__basemapLayer && map.hasLayer((map as any).__basemapLayer)) {
                    map.removeLayer((map as any).__basemapLayer);
                    (map as any).__basemapLayer = null;
                }
            } catch (e) {
                // ignore cleanup errors
            }
        };
    }, [map, mapRef, resolvedTheme]);

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
