import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

// This is the endpoint for the WMS GetCapabilities request
const NOAA_GET_CAPABILITIES_URL = 'https://opengeo.ncep.noaa.gov/geoserver/wms?service=WMS&version=1.3.0&request=GetCapabilities';

export async function GET() {
    try {
        // Fetch the XML data from NOAA. Next.js will automatically cache this response.
        // The `revalidate` option sets the cache lifetime to 1 day (86400 seconds).
        const response = await fetch(NOAA_GET_CAPABILITIES_URL, {
            next: { revalidate: 86400 } // Revalidate once a day
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch NOAA capabilities: ${response.statusText}`);
        }

        const xmlText = await response.text();

        // Parse the XML response
        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlText);

        // Extract the layer information
        const layers = jsonObj['WMS_Capabilities']['Capability']['Layer']['Layer']
            .map((layer: any) => ({
                name: layer.Name,
                title: layer.Title,
            }))
            // Filter out layers with no name or title, or non-weather layers
            .filter((layer: { name: any; title: string; }) => 
                layer.name && 
                layer.title && 
                !layer.title.toLowerCase().includes('tile index') &&
                !layer.title.toLowerCase().includes('counties')
            );

        return NextResponse.json(layers);
    } catch (error) {
        console.error('Error fetching or parsing NOAA layers:', error);
        return NextResponse.json({ error: 'Failed to retrieve weather layers.' }, { status: 500 });
    }
}
