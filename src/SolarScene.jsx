import * as THREE from "three";
import { useEffect, useRef } from "react";
import { initSolarScene } from "./three/initSolarScene";
import createPlanetSystem from "./three/createPlanetSystem";
import { startAnimation } from "./three/animate";

export default function SolarScene() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    console.log("effect running");
    if (!mountRef.current) return;
    const { scene, camera, renderer, controls, cleanup } = initSolarScene(mountRef.current);
    
    const sunTexture = new THREE.TextureLoader().load("/textures/sun.jpg");
    sunTexture.colorSpace = THREE.SRGBColorSpace;
    const sunSurfaceMaterial = new THREE.MeshStandardMaterial({
      map: sunTexture,
      color: 0xffffff,
      emissive: 0xffaa00,
      emissiveIntensity: 0.1
    });
    
    const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sunSurface = new THREE.Mesh(sunGeometry, sunSurfaceMaterial);
    scene.add(sunSurface);
    
    const sunLight = new THREE.PointLight(0xffffff, 8, 200);
    sunLight.position.set(0, 0, 0);
    sunSurface.add(sunLight);
    
    const earthTexture = new THREE.TextureLoader().load("/textures/earth.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    const earthSystem = createPlanetSystem({
      radius: 0.3,
      texture: earthTexture,
      color: 0x2233ff,
      distance: 5
    });
    scene.add(earthSystem.orbitGroup);
    
    const moonTexture = new THREE.TextureLoader().load("/textures/moon.jpg");
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    const moonSystem = createPlanetSystem({
      radius: 0.05,
      texture: moonTexture,
      color: 0x888888,
      distance: 0.6,
    });
    moonSystem.orbitGroup.position.copy(earthSystem.planet.position);
    earthSystem.orbitGroup.add(moonSystem.orbitGroup);

    const jupiterTexture = new THREE.TextureLoader().load("/textures/jupiter.jpg");
    jupiterTexture.colorSpace = THREE.SRGBColorSpace;
    const jupiterSystem = createPlanetSystem({
      radius: 0.6,
      texture: jupiterTexture,
      color: 0x884422,
      distance: 8,
    });
    scene.add(jupiterSystem.orbitGroup);

    const marsTexture = new THREE.TextureLoader().load("/textures/mars.jpg");
    marsTexture.colorSpace = THREE.SRGBColorSpace;
    const marsSystem = createPlanetSystem({
      radius: 0.2,
      texture: marsTexture,
      color: 0xff4422,
      distance: 7,
    });
    scene.add(marsSystem.orbitGroup);

    const venusTexture = new THREE.TextureLoader().load("/textures/venus.jpg");
    venusTexture.colorSpace = THREE.SRGBColorSpace;
    const venusSystem = createPlanetSystem({
      radius: 0.25,
      texture: venusTexture,
      color: 0xffaa00,
      distance: 4,
    });
    scene.add(venusSystem.orbitGroup);

    const mercuryTexture = new THREE.TextureLoader().load("/textures/mercury.jpg");
    mercuryTexture.colorSpace = THREE.SRGBColorSpace;
    const mercurySystem = createPlanetSystem({
      radius: 0.1,
      texture: mercuryTexture,
      color: 0xaaaaaa,
      distance: 3,
    });
    scene.add(mercurySystem.orbitGroup);

    const saturnTexture = new THREE.TextureLoader().load("/textures/saturn.jpg");
    saturnTexture.colorSpace = THREE.SRGBColorSpace;
    const saturnSystem = createPlanetSystem({
      radius: 0.5,
      texture: saturnTexture,
      color: 0xaaaa88,
      distance: 10,
    });
    scene.add(saturnSystem.orbitGroup);

    const uranusTexture = new THREE.TextureLoader().load("/textures/uranus.jpg");
    uranusTexture.colorSpace = THREE.SRGBColorSpace;
    const uranusSystem = createPlanetSystem({
      radius: 0.4,
      texture: uranusTexture,
      color: 0x88aaff,
      distance: 12,
    });
    scene.add(uranusSystem.orbitGroup);
    
    const systems = [
      { planet: earthSystem.planet, orbitGroup: earthSystem.orbitGroup, rotationSpeed: 0.01, orbitSpeed: 0.002 },
      { planet: moonSystem.planet, orbitGroup: moonSystem.orbitGroup, rotationSpeed: 0.02, orbitSpeed: 0.02 },
      { planet: jupiterSystem.planet, orbitGroup: jupiterSystem.orbitGroup, rotationSpeed: 0.005, orbitSpeed: 0.001 },
      { planet: marsSystem.planet, orbitGroup: marsSystem.orbitGroup, rotationSpeed: 0.008, orbitSpeed: 0.0015 },
      { planet: venusSystem.planet, orbitGroup: venusSystem.orbitGroup, rotationSpeed: 0.012, orbitSpeed: 0.002 },
      { planet: mercurySystem.planet, orbitGroup: mercurySystem.orbitGroup, rotationSpeed: 0.015, orbitSpeed: 0.003 },
      { planet: saturnSystem.planet, orbitGroup: saturnSystem.orbitGroup, rotationSpeed: 0.003, orbitSpeed: 0.001 },
      { planet: uranusSystem.planet, orbitGroup: uranusSystem.orbitGroup, rotationSpeed: 0.002, orbitSpeed: 0.001 }
    ];
    
    const stopAnimation = startAnimation({ renderer, scene, camera, controls, systems });

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
