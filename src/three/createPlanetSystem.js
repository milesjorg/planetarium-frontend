import * as THREE from "three";

export default function createPlanetSystem({
    radius,
    texture,
    color,
    distance,
    segments = 32
}) {
    const orbitGroup = new THREE.Group();
    const geometry = new THREE.SphereGeometry(radius, segments, segments);

    let material;
    if (texture) {
        material = new THREE.MeshStandardMaterial({ map: texture });
    } else {
        material = new THREE.MeshStandardMaterial({ color });
    }

    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    orbitGroup.add(planet);

    return { orbitGroup, planet };
}
