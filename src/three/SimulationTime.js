/**
 * Centralized time management for the solar system simulation
 * This module maintains the simulation time and provides methods to
 * query and control the passage of time
 */

class SimulationTime {
    constructor() {
        this.currentTime = 0;       // Current simulation time in seconds
        this.timeScale = 1;         // Multiplier for simulation speed (1 = real-time)
        this.isPaused = false;      // Whether simulation is paused
    }

    /**
     * Update the simulation time based on elapsed real time
     * @param {number} deltaTime - Real elapsed time in seconds
     */
    update(deltaTime) {
        if (this.isPaused) return;
        this.currentTime += deltaTime * this.timeScale;
    }

    /**
     * Get the current simulation time
     * @returns {number} Current simulation time in seconds
     */
    getCurrentTime() {
        return this.currentTime;
    }

    /**
     * Set the time scale multiplier
     * @param {number} scale - New time scale (e.g., 2 = twice as fast, 0.5 = half speed)
     */
    setTimeScale(scale) {
        this.timeScale = scale;
    }

    /**
     * Get the current time scale
     * @returns {number} Current time scale
     */
    getTimeScale() {
        return this.timeScale;
    }

    /**
     * Pause the simulation
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume the simulation
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Check if simulation is paused
     * @returns {boolean} True if paused
     */
    getIsPaused() {
        return this.isPaused;
    }

    /**
     * Reset simulation time to zero
     */
    reset() {
        this.currentTime = 0;
    }

    getJulianDate() {
        // Convert current simulation time (in seconds) to Julian Date
        // Assuming simulation starts at J2000.0 (January 1, 2000, 12:00 TT)
        const J2000 = 2451545.0; // Julian Date for J2000.0
        const secondsPerDay = 86400;
        return J2000 + this.currentTime / secondsPerDay;
    }
}

/**
 * Singleton instance of SimulationTime
 * All parts of the application (animation loop, React components, etc.)
 * use this same instance to ensure a single source of truth for time
 */
export const simTime = new SimulationTime();

/**
 * Export the class for testing or creating additional instances if needed
 */
export { SimulationTime };
