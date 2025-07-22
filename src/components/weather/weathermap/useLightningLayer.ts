import { useEffect } from 'react';
import L from 'leaflet';

const NOAA_TILE_URL = 'https://opengeo.ncep.noaa.gov/geoserver/wms';
const LIGHTNING_LAYER_NAME = 'goes_glm_l2_flash_extent_density';

export function useLightningLayer({
  mapRef,
  lightningTimestamps,
  currentTimeIndex,
  showLightning,
  lightningLayerRef,
  radarTimestamps,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
  lightningTimestamps: string[];
  currentTimeIndex: number | null;
  showLightning: boolean;
  lightningLayerRef: React.MutableRefObject<L.TileLayer.WMS | null>;
  radarTimestamps: string[];
}) {
  useEffect(() => {
    if (!mapRef.current || lightningTimestamps.length === 0) return;
    const map = mapRef.current;
    if (showLightning) {
      if (lightningLayerRef.current) {
        map.removeLayer(lightningLayerRef.current);
      }
      // Synchronize lightning time with radar's currentTimeIndex if possible
      let lightningTime = lightningTimestamps[lightningTimestamps.length - 1];
      if (
        currentTimeIndex !== null &&
        radarTimestamps.length === lightningTimestamps.length
      ) {
        lightningTime = lightningTimestamps[currentTimeIndex];
      }
      const lightningLayer = L.tileLayer.wms(NOAA_TILE_URL, {
        layers: LIGHTNING_LAYER_NAME,
        format: 'image/png',
        transparent: true,
        time: lightningTime,
        opacity: 0.9,
        attribution: 'NOAA/NWS',
        version: '1.3.0',
      } as any);
      lightningLayer.addTo(map);
      lightningLayerRef.current = lightningLayer;
    } else {
      if (lightningLayerRef.current && map.hasLayer(lightningLayerRef.current)) {
        map.removeLayer(lightningLayerRef.current);
        lightningLayerRef.current = null;
      }
    }
  }, [showLightning, lightningTimestamps, currentTimeIndex, mapRef, lightningLayerRef, radarTimestamps]);
}
