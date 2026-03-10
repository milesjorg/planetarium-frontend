import { useState, useEffect } from 'react';
import { simTime } from '../three/SimulationTime';
import './TimeControls.css';

export default function TimeControls() {
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(1);

    // Handle pause/play toggle
    const handlePlayPause = () => {
        if (isPaused) {
            simTime.resume();
            setIsPaused(false);
        } else {
            simTime.pause();
            setIsPaused(true);
        }
    };

    // Handle speed slider change
    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        console.log("Setting time scale to", newSpeed);
        setSpeed(newSpeed);
        simTime.setTimeScale(newSpeed);
    };

    return (
        <div className="time-controls">
            <button 
                className="control-button play-pause-button"
                onClick={handlePlayPause}
                title={isPaused ? "Resume simulation" : "Pause simulation"}
            >
                {isPaused ? '▶' : '⏸'}
            </button>

            <div className="speed-control">
                <label htmlFor="speed-slider">Speed:</label>
                <input
                    id="speed-slider"
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={speed}
                    onChange={handleSpeedChange}
                    className="slider"
                    title={`Speed: ${speed.toFixed(1)}x`}
                />
                <span className="speed-value">{speed.toFixed(1)}x</span>
            </div>
        </div>
    );
}
