import * as THREE from "three";
import { createPlanetMesh } from "./CreatePlanetMesh";

export function createPlanetSystem({
    radius,
    texture,
    color,
    segments = 32,
}) {
    const group = new THREE.Group();
    const mesh = createPlanetMesh({ radius, texture, color, segments });
    group.add(mesh);
    return { group, mesh };
}
