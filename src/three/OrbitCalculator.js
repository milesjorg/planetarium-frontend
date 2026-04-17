import { simTime } from "./SimulationTime";

export const AU_TO_UNITS = 10;
export const SOLAR_RADIUS = 1;  // Sun's visual size
export const PLANET_RADIUS_SCALE = 50;  // Global visibility multiplier for planets

// Realistic planet radius ratios relative to the Sun, scaled for visibility
export const PLANET_RADII = {
    mercury: 0.0056 * PLANET_RADIUS_SCALE,
    venus: 0.0087 * PLANET_RADIUS_SCALE,
    earth: 0.0091 * PLANET_RADIUS_SCALE,
    mars: 0.0048 * PLANET_RADIUS_SCALE,
    jupiter: 0.1003 * PLANET_RADIUS_SCALE,
    saturn: 0.0836 * PLANET_RADIUS_SCALE,
    uranus: 0.0365 * PLANET_RADIUS_SCALE,
    neptune: 0.0354 * PLANET_RADIUS_SCALE,
    moon: 0.0025 * PLANET_RADIUS_SCALE,
};

class OrbitCalculator {
    constructor() {
        this.cache = new Map(); // Cache for storing computed orbits
    }

    async getPlanetPositions(julianDate) {
        // Round JD to avoid excessive precision in cache keys
        const roundedJD = Math.round(julianDate * 1000) / 1000;

        // Check cache first
        if (this.cache.has(roundedJD)) {
            return this.cache.get(roundedJD);
        }

        // If not in cache, fetch from API
        try {
            const response = await fetch(
                `/planets?julian_date=${roundedJD}`
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            const rawPositionData = await response.json();

            // Validate response structure
            if (!rawPositionData || typeof rawPositionData !== 'object') {
                throw new Error('Invalid response format: expected object, got ' + typeof rawPositionData);
            }

            const convertedPositions = this.convertPositions(rawPositionData);

            // Store in cache
            this.cache.set(roundedJD, convertedPositions);

        } catch (error) {
            console.error('OrbitCalculator: Failed to fetch planet positions', error);
            return null;
        }
    }

    // Converts raw API positions to Three.js coordinates
    convertPositions(rawData) {
        // Validate planets array exists and is an array
        if (!rawData.planets || !Array.isArray(rawData.planets)) {
            throw new Error('Invalid position data: missing or invalid planets array');
        }

        if (rawData.planets.length === 0) {
            throw new Error('Invalid position data: planets array is empty');
        }

        const converted = {};

        rawData.planets.forEach(planetData => {
            // Validate required fields
            if (!planetData.planet || typeof planetData.planet !== 'string') {
                throw new Error('Invalid planet data: missing or invalid planet name');
            }

            if (typeof planetData.x !== 'number' || typeof planetData.y !== 'number' || typeof planetData.z !== 'number') {
                throw new Error(`Invalid coordinates for ${planetData.planet}: expected numbers, got x=${typeof planetData.x}, y=${typeof planetData.y}, z=${typeof planetData.z}`);
            }

            // Check for NaN values
            if (isNaN(planetData.x) || isNaN(planetData.y) || isNaN(planetData.z)) {
                throw new Error(`Invalid coordinates for ${planetData.planet}: received NaN values`);
            }

            converted[planetData.planet] = {
                x: planetData.x * AU_TO_UNITS,
                y: planetData.y * AU_TO_UNITS,
                z: planetData.z * AU_TO_UNITS
            };
        });

        return converted;
    }
}

export const orbitCalculator = new OrbitCalculator();
