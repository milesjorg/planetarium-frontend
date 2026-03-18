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

        // Initialize to today's date converted to Julian Date
        this.startJulianDate = this._getTodayAsJulianDate();
    }

    /**
     * Get today's date as a Julian Date
     * @private
     * @returns {number} Julian Date for today
     */
    _getTodayAsJulianDate() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();

        // Gregorian to Julian Date algorithm
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;

        const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        const fraction = (hours + minutes / 60 + seconds / 3600) / 24;
        return jdn + fraction - 0.5;
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
        // Starts from the configured start date (defaults to today)
        const secondsPerDay = 86400;
        return this.startJulianDate + this.currentTime / secondsPerDay;
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
