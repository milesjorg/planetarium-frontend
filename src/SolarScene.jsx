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
    
    const systems = [
      { planet: earthSystem.planet, orbitGroup: earthSystem.orbitGroup, rotationSpeed: 0.01, orbitSpeed: 0.002 },
      { planet: moonSystem.planet, orbitGroup: moonSystem.orbitGroup, rotationSpeed: 0.02, orbitSpeed: 0.02 }
    ];
    
    const stopAnimation = startAnimation({ renderer, scene, camera, controls, systems });


    // TODO: Fix this cleanup function
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
