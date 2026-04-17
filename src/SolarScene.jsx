import * as THREE from "three";
import { useEffect, useRef } from "react";
import { initSolarScene } from "./three/InitSolarScene";
import { createPlanetSystem } from "./three/CreatePlanetSystem";
import { createPlanetMesh } from "./three/CreatePlanetMesh";
import { startAnimation } from "./three/Animate";
import { PLANET_RADII } from "./three/OrbitCalculator";

const PLANETS = [
    {name: "mercury", radius: PLANET_RADII.mercury, texture: "/textures/mercury.jpg", color: 0xaaaaaa, rotationSpeed: 0.015 },
    {name: "venus", radius: PLANET_RADII.venus, texture: "/textures/venus.jpg", color: 0xffaa00, rotationSpeed: 0.012 },
    {name: "earth", radius: PLANET_RADII.earth, texture: "/textures/earth.jpg", color: 0x2233ff, rotationSpeed: 0.01 },
    {name: "mars", radius: PLANET_RADII.mars, texture: "/textures/mars.jpg", color: 0xff4422, rotationSpeed: 0.008 },
    {name: "jupiter", radius: PLANET_RADII.jupiter, texture: "/textures/jupiter.jpg", color: 0x884422, rotationSpeed: 0.005 },
    {name: "saturn", radius: PLANET_RADII.saturn, texture: "/textures/saturn.jpg", color: 0xaaaa88, rotationSpeed: 0.003 },
    {name: "uranus", radius: PLANET_RADII.uranus, texture: "/textures/uranus.jpg", color: 0x88aaff, rotationSpeed: 0.002 },
    {name: "neptune", radius: PLANET_RADII.neptune, texture: "/textures/neptune.jpg", color: 0x4444ff, rotationSpeed: 0.001 },
]

const MOONS = [
    {name: "moon", radius: PLANET_RADII.moon, texture: "/textures/moon.jpg", color: 0x888888, rotationSpeed: 0.02 , parent: "earth"},
]

function loadTexture(path) {
  const texture = new THREE.TextureLoader().load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSun(scene) {
  const sunTexture = loadTexture("/textures/sun.jpg");
  const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    color: 0xffffff,
    emissive: 0xffaa00,
    emissiveIntensity: 0.1
  });

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 128), sunMaterial);
  scene.add(sun);

  const light = new THREE.PointLight(0xffffff, 25, 0, 1.4);
  sun.add(light);
  return sun;
}

export default function SolarScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    console.log("effect running");
    if (!mountRef.current) return;
    const { scene, camera, renderer, controls, cleanup } = initSolarScene(mountRef.current);

    // Create sun
    createSun(scene);


    const planetSystems = {};
    const celestialBodies = [];

    PLANETS.forEach(config => {
      const texture = loadTexture(config.texture);
      const { group, mesh } = createPlanetSystem({
        ...config,
        radius: config.radius,
        texture,
      });
      scene.add(group);
      planetSystems[config.name] = { group, mesh };

      celestialBodies.push({
        planetName: config.name,
        planet: mesh,
        orbitGroup: group,
        rotationSpeed: config.rotationSpeed,
      });
    });

    // Add moons
    MOONS.forEach(moonConfig => {
      const texture = loadTexture(moonConfig.texture);
      const { group: moonGroup, mesh: moonMesh } = createPlanetSystem({
        ...moonConfig,
        radius: moonConfig.radius,
        texture,
      });

      const parentPlanet = planetSystems[moonConfig.parent];
      parentPlanet.group.add(moonGroup);

      celestialBodies.push({
        planetName: moonConfig.name,
        planet: moonMesh,
        orbitGroup: moonGroup,
        rotationSpeed: moonConfig.rotationSpeed,
      });
    });

    const stopAnimation = startAnimation({ renderer, scene, camera, controls, systems: celestialBodies });

    return () => {
      stopAnimation();
      cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}
    />
  );
}
