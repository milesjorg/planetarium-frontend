import * as THREE from 'three';
import { SimulationTime } from './SimulationTime';

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
    const simTime = new SimulationTime(); // Create centralized time manager
    console.log("Starting animation loop");

    function updateBody(system, simulationTime) {
        system.planet.rotation.y += system.rotationSpeed * clock.getDelta();

    }

    function animate() {
        if (!running) return;

        frameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        simTime.update(delta); // Delegate time updating to centralized time manager

        systems.forEach(system => {
            system.planet.rotation.y += system.rotationSpeed * delta;
            system.orbitGroup.rotation.y += system.orbitSpeed * delta;
            updateBody(system, simTime.getCurrentTime());
        });

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
