import * as THREE from 'three';
import { simTime } from './SimulationTime';

export function startAnimation({
    renderer,
    scene,
    camera,
    controls,
    systems
}) {
    let frameId = null;
    let running = true;
    const clock = new THREE.Clock();
    console.log("Starting animation loop");

    function animate() {
        if (!running) return;

        frameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        simTime.update(delta); // Delegate time updating to centralized time manager

        // Calculate the simulated delta (real time multiplied by time scale)
        const simulatedDelta = delta * simTime.getTimeScale();

        // Only update planet positions/rotations if simulation is not paused
        if (!simTime.getIsPaused()) {
            systems.forEach(system => {
                system.planet.rotation.y += system.rotationSpeed * simulatedDelta;
                system.orbitGroup.rotation.y += system.orbitSpeed * simulatedDelta;
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
