import { NextResponse } from 'next/server';
import { DOMParser } from 'xmldom';

const NOAA_WMS_URL = 'https://opengeo.ncep.noaa.gov/geoserver/wms';

async function getLayerTimestamps(layerName: string) {
    try {
        const response = await fetch(`${NOAA_WMS_URL}?service=WMS&request=GetCapabilities&version=1.3.0`);
        if (!response.ok) {
            throw new Error(`Failed to fetch capabilities: ${response.statusText}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        const layers = xmlDoc.getElementsByTagName('Layer');
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            const nameElement = layer.getElementsByTagName('Name')[0];
            if (nameElement && nameElement.textContent === layerName) {
                const dimensionElement = Array.from(layer.getElementsByTagName('Dimension')).find(
                    (el) => el.getAttribute('name') === 'time'
                );
                if (dimensionElement && dimensionElement.textContent) {
                    return dimensionElement.textContent.split(',').map((t: string) => t.trim());
                }
            }
        }
        return [];
    } catch (error) {
        console.error('Error fetching layer timestamps:', error);
        return [];
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const layer = searchParams.get('layer');

    if (!layer) {
        return NextResponse.json({ error: 'Layer parameter is required' }, { status: 400 });
    }

    const timestamps = await getLayerTimestamps(layer);
    return NextResponse.json({ timestamps });
}
