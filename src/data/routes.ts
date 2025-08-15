// Central place to list static top-level routes that are not content-derived.
// Keep this tiny; dynamic content like notes is auto-discovered from src/data/notes.
const staticRoutes = [
    '/', '/notes', // Default routes
    '/weather', '/fishing' // Other custom routes
]
export default staticRoutes
