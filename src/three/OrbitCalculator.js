import { simTime } from "./SimulationTime";

export const AU_TO_UNITS = 50;
export const PLANET_SIZE_MULT = 500;

class OrbitCalculator {
    constructor() {
        this.cache = new Map(); // Cache for storing computed orbits
        this.lastFetchTime = 0;
        this.lastPositions = null;
    }

    async getPlanetPositions(julianDate) {
        const currentTime = simTime.getCurrentTime();
        const shouldFetch = (currentTime - this.lastFetchTime) > this.getInterval();

        // Return cached positions if we recently fetched and have them available
        if (!shouldFetch && this.lastPositions) {
            return this.lastPositions;
        }

        // Round JD to avoid excessive precision in cache keys
        const roundedJD = Math.round(julianDate * 10) / 10;

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

            // Store in cache and update last fetch time and positions
            this.cache.set(roundedJD, convertedPositions);
            this.lastFetchTime = currentTime;
            this.lastPositions = convertedPositions;

            return convertedPositions;
        } catch (error) {
            console.error('OrbitCalculator: Failed to fetch planet positions', error);
            // Return last known positions if available, otherwise null
            return this.lastPositions || null;
        }
    }

    getInterval() {
        // Adaptive interval based on time scale
        const baseInterval = 1; // 1 sec of sim time
        const speed = Math.abs(simTime.getTimeScale());
        return baseInterval * Math.max(1, Math.ceil(speed / 10)); // Increase interval for higher speeds
    }

    // Converts raw API positions to Three.js coordinates
    convertPositions(rawPos) {
        // Validate that required fields exist
        if (typeof rawPos.x !== 'number' || typeof rawPos.y !== 'number' || typeof rawPos.z !== 'number') {
            throw new Error('Invalid position data: missing or invalid x, y, z coordinates');
        }
        
        // Convert from AU to Three.js units
        return {
            x: rawPos.x * AU_TO_UNITS,
            y: rawPos.y * AU_TO_UNITS,
            z: rawPos.z * AU_TO_UNITS
        };
    }
}

export const orbitCalculator = new OrbitCalculator();