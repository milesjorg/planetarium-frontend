import * as THREE from 'three';
import { simTime } from './SimulationTime';
import { orbitCalculator } from './OrbitCalculator';

export function startAnimation({
    renderer,
    scene,
    camera,
    controls,
    systems: celestialBodies
}) {
    let frameId = null;
    let running = true;
    const clock = new THREE.Clock();
    console.log("Starting animation loop");

    function animate() {
        if (!running) return;

        frameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        simTime.update(delta);

        // Calculate the simulated delta (real time multiplied by time scale)
        const simulatedDelta = delta * simTime.getTimeScale();

        // Always fetch and update planet positions based on current JD
        const julianDate = simTime.getJulianDate();
        orbitCalculator.getPlanetPositions(julianDate).then(positions => {
            if (positions) {
                celestialBodies.forEach(system => {
                    const planetPos = positions[system.planetName];
                    if (planetPos) {
                        system.orbitGroup.position.set(planetPos.x, planetPos.y, planetPos.z);
                    }
                });
            }
        });

        // Only update planet rotations if simulation is not paused
        if (!simTime.getIsPaused()) {
            celestialBodies.forEach(system => {
                // Always update axial rotation (independent of position updates)
                system.planet.rotation.y += system.rotationSpeed * simulatedDelta;
            });
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    return () => {
        running = false;
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
        }
    };
}
