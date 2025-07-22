'use client';

// WeatherMap component: Leaflet + NOAA Radar Overlay
import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { MapDisplay } from './weathermap/MapDisplay';
import { PlaybackControls } from './weathermap/PlaybackControls';
import { useRadarLayer } from './weathermap/useRadarLayer';
import { useLightningLayer } from './weathermap/useLightningLayer';
import { useTimestamps } from './weathermap/useTimestamps';

const NOAA_TILE_URL = 'https://opengeo.ncep.noaa.gov/geoserver/wms';
const LIGHTNING_LAYER_NAME = 'goes_glm_l2_flash_extent_density';

export default function WeatherMap({ radarLayer, showLightning }: { radarLayer: string, showLightning: boolean }) {
    // Use custom hooks for timestamps
    const { timestamps, isLoading } = useTimestamps(radarLayer);
    const { timestamps: lightningTimestamps } = useTimestamps('goes_glm_l2_flash_extent_density');
    const [currentTimeIndex, setCurrentTimeIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const activeLayerRef = useRef<L.TileLayer.WMS | null>(null);
    const lightningLayerRef = useRef<L.TileLayer.WMS | null>(null);

    // Set currentTimeIndex when timestamps change
    useEffect(() => {
        if (timestamps.length > 0) {
            setCurrentTimeIndex(timestamps.length - 1);
        } else {
            setCurrentTimeIndex(null);
        }
        setIsPlaying(false);
    }, [timestamps]);

    // Radar and lightning layer effects
    useRadarLayer({ mapRef, radarLayer, timestamps, currentTimeIndex, activeLayerRef });
    useLightningLayer({ mapRef, lightningTimestamps, currentTimeIndex, showLightning, lightningLayerRef, radarTimestamps: timestamps });

    // Animation playback effect
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTimeIndex((prevIndex) => {
                    if (prevIndex === null || prevIndex >= timestamps.length - 1) {
                        return 0;
                    }
                    return prevIndex + 1;
                });
            }, 1000);
        } else {
            intervalRef.current && clearInterval(intervalRef.current);
        }
        return () => {
            intervalRef.current && clearInterval(intervalRef.current);
        };
    }, [isPlaying, timestamps.length]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPlaying(false);
        setCurrentTimeIndex(parseInt(e.target.value, 10));
    };

    return (
        <div className="relative w-full h-full flex flex-col bg-gray-800 rounded-lg shadow-lg">
            <MapDisplay mapRef={mapRef} />
            <div className="absolute top-2 left-2 z-[1000] bg-gray-800 bg-opacity-50 text-white p-2 rounded-md shadow-lg">
                {isLoading ? (
                    <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
                        </svg>
                        Loading...
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePlayPause}
                            className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none"
                            disabled={isLoading}
                        >
                            {isPlaying ? (
                                <PauseIcon className="h-5 w-5 text-white" />
                            ) : (
                                <PlayIcon className="h-5 w-5 text-white" />
                            )}
                        </button>
                        <div className="text-sm">
                            {timestamps.length > 0 && currentTimeIndex !== null
                                ? new Date(timestamps[currentTimeIndex]).toLocaleString()
                                : 'No data'}
                        </div>
                    </div>
                )}
            </div>
            <PlaybackControls
                isPlaying={isPlaying}
                isLoading={isLoading}
                onPlayPause={handlePlayPause}
                timestamps={timestamps}
                currentTimeIndex={currentTimeIndex}
                onSliderChange={handleSliderChange}
            />
        </div>
    );
}
