import { useState, useEffect } from 'react';
import { simTime } from '../three/SimulationTime';
import './TimeControls.css';

export default function TimeControls() {
    const [julianDate, setJulianDate] = useState('2451545.0');

    // Handle arrow key navigation (up/down increments JD by 1.0 and jumps)
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const currentJD = parseFloat(julianDate) || 0;
            const newJD = (currentJD + 1.0).toFixed(1);
            setJulianDate(newJD);
            // Jump to the new date
            setTimeout(() => jumpToJD(parseFloat(newJD)), 0);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const currentJD = parseFloat(julianDate) || 0;
            const newJD = (currentJD - 1.0).toFixed(1);
            setJulianDate(newJD);
            // Jump to the new date
            setTimeout(() => jumpToJD(parseFloat(newJD)), 0);
        } else if (e.key === 'Enter') {
            handleJumpToJD();
        }
    };

    // Extract jump logic to reuse
    const jumpToJD = (jd) => {
        if (isNaN(jd)) {
            alert('Please enter a valid Julian Date number');
            return;
        }

        simTime.pause();
        const startJD = simTime.startJulianDate;
        const jdDifference = jd - startJD;
        const secondsDifference = jdDifference * 86400;
        simTime.currentTime = secondsDifference;
        console.log('Jumped to JD:', jd);
    };

    // Jump to specified Julian Date
    const handleJumpToJD = () => {
        jumpToJD(parseFloat(julianDate));
    };

    return (
        <div className="time-controls-panel">
            <div className="jd-input-container">
                <label htmlFor="jd-input" className="jd-label">Julian Date:</label>
                <input
                    id="jd-input"
                    type="number"
                    step="1.0"
                    value={julianDate}
                    onChange={(e) => setJulianDate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Julian Date"
                    className="jd-input"
                />
                <button
                    onClick={handleJumpToJD}
                    className="jd-button"
                >
                    Go
                </button>
            </div>
        </div>
    );
}
