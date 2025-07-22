# Weather Radar Page Setup

This page uses Mapbox and NOAA for a live weather radar experience.

## Setup Instructions

1. **Mapbox Token**
   - Create a `.env.local` file in the project root (if not already present).
   - Add your Mapbox public access token:
     ```env
     NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
     ```
   - You can get a free token at https://account.mapbox.com/

2. **NOAA Radar**
   - The radar overlay uses NOAA's public WMS service. No API key is required.

3. **Run the App**
   - Start your Next.js app as usual:
     ```sh
     npm run dev
     ```

4. **UI/UX**
   - The page uses Hero UI and Tailwind for a modern, responsive look.
   - Pan and zoom the map to explore radar data.

---

For further customization, edit `src/app/weather/page.tsx` and `src/components/weather/WeatherMap.tsx`.
