import * as THREE from "three";

/**
 * Creates a THREE.js mesh representing a planet's visual appearance
 * @param {Object} config
 * @param {number} config.radius - Planet radius in world units
 * @param {THREE.Texture} [config.texture] - Planet surface texture
 * @param {number} [config.color] - Fallback color if no texture (hex, default: 0xaaaaaa)
 * @param {number} [config.segments] - Sphere geometry segments (default: 32)
 * @returns {THREE.Mesh} The planet mesh
 */

export function createPlanetMesh({
    radius,
    texture,
    color,
    segments = 32
}) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = texture
        ? new THREE.MeshStandardMaterial({ map: texture })
        : new THREE.MeshStandardMaterial({ color: color || 0x800080 });

    return new THREE.Mesh(geometry, material);
}
