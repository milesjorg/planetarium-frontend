import * as THREE from "three";

export default function createPlanetSystem({
  radius,
  textureURL,
  color,
  distance,
  segments = 32
}) {
  const orbitGroup = new THREE.Group();
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  
  const textureLoader = new THREE.TextureLoader();

  let material;
  if (textureURL) {
    const texture = textureLoader.load(textureURL);
    texture.colorSpace = THREE.SRGBColorSpace;
    material = new THREE.MeshStandardMaterial({ map: texture });
  } else {
    material = new THREE.MeshStandardMaterial({ color });
  }

  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = distance;
  orbitGroup.add(planet);

  return { orbitGroup, planet };
}