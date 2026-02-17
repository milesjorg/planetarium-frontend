export function startAnimation({
    renderer,
    scene,
    camera,
    controls,
    systems
}) {
    function animate() {
        requestAnimationFrame(animate);

        systems.forEach(system => {
            system.planet.rotation.y += system.rotationSpeed;
            system.orbitGroup.rotation.y += system.orbitSpeed;
        });

        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
}