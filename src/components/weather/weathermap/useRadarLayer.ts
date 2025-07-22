import { useEffect } from 'react';
import L from 'leaflet';

const NOAA_TILE_URL = 'https://opengeo.ncep.noaa.gov/geoserver/wms';

export function useRadarLayer({
  mapRef,
  radarLayer,
  timestamps,
  currentTimeIndex,
  activeLayerRef,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
  radarLayer: string;
  timestamps: string[];
  currentTimeIndex: number | null;
  activeLayerRef: React.MutableRefObject<L.TileLayer.WMS | null>;
}) {
  useEffect(() => {
    if (currentTimeIndex === null || !mapRef.current || timestamps.length === 0) return;
    const map = mapRef.current;
    const selectedTime = timestamps[currentTimeIndex];
    const oldLayer = activeLayerRef.current;
    const newLayer = L.tileLayer.wms(NOAA_TILE_URL, {
      layers: radarLayer,
      format: 'image/png',
      transparent: true,
      time: selectedTime,
      opacity: 0,
      attribution: 'NOAA/NWS',
      version: '1.3.0',
    } as any);
    newLayer.addTo(map);
    activeLayerRef.current = newLayer;
    newLayer.once('load', () => {
      if (!oldLayer) {
        let newOpacity = 0;
        const fadeInInterval = setInterval(() => {
          newOpacity += 0.1;
          if (newOpacity >= 0.7) {
            newOpacity = 0.7;
            clearInterval(fadeInInterval);
          }
          newLayer.setOpacity(newOpacity);
        }, 50);
        return;
      }
      let newOpacity = 0;
      let oldOpacity = oldLayer.options.opacity || 0.7;
      const transitionInterval = setInterval(() => {
        newOpacity += 0.1;
        oldOpacity -= 0.1;
        newLayer.setOpacity(newOpacity);
        oldLayer.setOpacity(oldOpacity);
        if (newOpacity >= 0.7) {
          newLayer.setOpacity(0.7);
          if (map.hasLayer(oldLayer)) {
            map.removeLayer(oldLayer);
          }
          clearInterval(transitionInterval);
        }
      }, 50);
    });
  }, [currentTimeIndex, radarLayer, timestamps, mapRef, activeLayerRef]);
}
