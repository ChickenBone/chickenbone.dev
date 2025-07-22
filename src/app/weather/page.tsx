'use client';
// Weather Radar Page using Hero UI, NOAA API, and OpenStreetMap
import React, { useState, useEffect } from 'react';
import WeatherMap from '@/components/weather/WeatherMap';
import { getRadarProductName } from '@/components/weather/weathermap/radarProductNames';

interface RadarLayer {
    name: string;
    title: string;
}

export default function WeatherPage() {
    const [radarLayer, setRadarLayer] = useState('');
    const [showLightning, setShowLightning] = useState(false);
    const [radarLayers, _setRadarLayers] = useState<RadarLayer[]>([]);
    const setRadarLayers = (layers: RadarLayer[]) => {
        const allowed = ['kftg', 'tden', 'conus_bref_qcd', 'conus', 'ridge_', '_all_regions'];
        const notAllowedExact = ['conus_bref_qcd_hires', 'ridge_bref_raw', 'legacy_conus_small'];
        _setRadarLayers(
            layers.filter(layer =>
                allowed.some(sub => layer.title.toLowerCase().includes(sub)) &&
                !notAllowedExact.includes(layer.name)
            )
        );
    };
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLayers() {
            try {
                const response = await fetch('/api/weather/layers');
                if (!response.ok) {
                    throw new Error('Failed to fetch layers');
                }
                const layers = await response.json();
                setRadarLayers(layers);
                if (layers.length > 0) {
                    // Find the default layer or fallback to the first one
                    const defaultLayer = layers.find((l: RadarLayer) => l.name === 'conus_bref_qcd') || layers[0];
                    setRadarLayer(defaultLayer.name);
                }
            } catch (error) {
                console.error(error);
                // Fallback to a default list if the API fails
                setRadarLayers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchLayers();
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-start p-4">
            <section className="w-full h-[700px] mt-8">
                <div className="rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 w-full">
                        <div className="max-w-xs">
                            <label htmlFor="radar-select" className="block text-sm font-medium text-gray-700 mb-1">Radar Source</label>
                            <select
                                id="radar-select"
                                value={radarLayer}
                                onChange={(e) => setRadarLayer(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                disabled={loading}
                            >
                                {loading ? (
                                    <option>Loading layers...</option>
                                ) : (
                                    radarLayers.map((layer) => (
                                        <option key={layer.name} value={layer.name}>{getRadarProductName(layer.name)}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* <div className="flex items-center pt-6">
                            <input
                                id="lightning-checkbox"
                                type="checkbox"
                                checked={showLightning}
                                onChange={(e) => setShowLightning(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="lightning-checkbox" className="ml-2 block text-sm">
                                Show Lightning
                            </label>
                        </div> */}
                    </div>

                    <div className="w-full h-[700px] rounded-lg overflow-hidden">
                        <WeatherMap radarLayer={radarLayer} showLightning={showLightning} />
                    </div>
                </div>
            </section>
        </main>
    );
}
