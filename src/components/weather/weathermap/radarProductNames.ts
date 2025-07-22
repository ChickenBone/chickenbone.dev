// Radar product code to user-friendly name mapping
export const RADAR_PRODUCT_NAMES: Record<string, string> = {
  BREF1: 'Base Reflectivity',
  BVEL: 'Base Radial Velocity',
  BREFL: 'Long Range Base Reflectivity',
  'conus_bref_qcd': 'CONUS Base Reflectivity',
  'conus_bref_qcd_hires': 'CONUS Hi-Res Reflectivity',
  'ridge_bref_raw': 'NEXRAD Base Reflectivity (Raw)',
};

export function getRadarProductName(code: string): string {
  return RADAR_PRODUCT_NAMES[code] || code;
}
