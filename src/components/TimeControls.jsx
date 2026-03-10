import { useState } from 'react';
import { simTime } from '../three/SimulationTime';
import './TimeControls.css';

export default function TimeControls() {
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(1);

    const speedPresets = [1, 2, 4, 10, 50, 100, 500, 1000];

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

    // Handle preset speed button click
    const handleSpeedPreset = (presetSpeed) => {
        setSpeed(presetSpeed);
        simTime.setTimeScale(presetSpeed);
    };

    return (
        <div className="time-controls">
            <button 
                className={`play-pause-button ${isPaused ? 'paused' : ''}`}
                onClick={handlePlayPause}
                title={isPaused ? "Resume simulation" : "Pause simulation"}
            >
                {isPaused ? '▶' : '⏸'}
            </button>

            <div className="speed-presets">
                {speedPresets.map((preset) => (
                    <button
                        key={preset}
                        className={`speed-button ${speed === preset ? 'active' : ''}`}
                        onClick={() => handleSpeedPreset(preset)}
                        // title={`Set simulation to ${preset}x speed`}
                    >
                        {preset}x
                    </button>
                ))}
            </div>
        </div>
    );
}
