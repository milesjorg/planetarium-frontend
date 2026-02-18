export function startAnimation({
    renderer,
    scene,
    camera,
    controls,
    systems
}) {
    let frameId = null;
    let running = true;
    console.log("Starting animation loop");
    
    function animate() {
        if (!running) return;
        
        frameId = requestAnimationFrame(animate);
        
        systems.forEach(system => {
            system.planet.rotation.y += system.rotationSpeed;
            system.orbitGroup.rotation.y += system.orbitSpeed;
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
