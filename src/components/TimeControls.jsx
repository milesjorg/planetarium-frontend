import { useState, useEffect } from 'react';
import { simTime } from '../three/SimulationTime';
import './TimeControls.css';

export default function TimeControls() {
    const [isPaused, setIsPaused] = useState(false);
    const [speedIndex, setSpeedIndex] = useState(0);

    // Speed presets array - centered at index 8 (neutral speed of 1x)
    const speedPresets = [-1000, -500, -100, -50, -10, -4, -2, -1, 1, 2, 4, 10, 50, 100, 500, 1000];
    const currentSpeed = speedPresets[speedIndex];
    
    // Calculate number of arrow symbols to display
    const getSpeedSymbols = () => {
        const neutralIndex = 8; // Index where 1x is located
        if (speedIndex < neutralIndex) {
            // Negative speeds: show reversed arrows (◀)
            const numSymbols = neutralIndex - speedIndex;
            return '◀'.repeat(numSymbols);
        } else {
            // Positive speeds: show forward arrows (▶)
            const numSymbols = (speedIndex - neutralIndex) + 1;
            return '▶'.repeat(numSymbols);
        }
    };

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

    // Handle speed increase (forward in presets)
    const increaseSpeed = () => {
        if (speedIndex < speedPresets.length - 1) {
            const newIndex = speedIndex + 1;
            setSpeedIndex(newIndex);
            simTime.setTimeScale(speedPresets[newIndex]);
        }
    };

    // Handle speed decrease (backward in presets)
    const decreaseSpeed = () => {
        if (speedIndex > 0) {
            const newIndex = speedIndex - 1;
            setSpeedIndex(newIndex);
            simTime.setTimeScale(speedPresets[newIndex]);
        }
    };

    // Keyboard event listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/') {
                e.preventDefault();
                increaseSpeed();
            } else if (e.key === '.') {
                e.preventDefault();
                decreaseSpeed();
            } else if (e.key === ',') {
                e.preventDefault();
                handlePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [speedIndex, isPaused]);

    return (
        <div className="time-controls-panel">
            {/* Speed and pause display */}
            <div className="time-display">
                <button 
                    className={`play-pause-button ${isPaused ? 'paused' : ''}`}
                    onClick={handlePlayPause}
                    title="Pause/Play (Key: ,)"
                >
                    {isPaused ? '▶' : '⏸'}
                </button>
                <div className="speed-display">
                    <span className="speed-symbols">{getSpeedSymbols()}</span>
                </div>
            </div>

            {/* Keyboard controls legend */}
            <div className="controls-legend">
                <div className="legend-title">Controls</div>
                <div className="legend-item">
                    <span className="legend-key">/</span>
                    <span className="legend-text">Speed Up</span>
                </div>
                <div className="legend-item">
                    <span className="legend-key">.</span>
                    <span className="legend-text">Speed Down</span>
                </div>
                <div className="legend-item">
                    <span className="legend-key">,</span>
                    <span className="legend-text">Pause/Play</span>
                </div>
            </div>
        </div>
    );
}
