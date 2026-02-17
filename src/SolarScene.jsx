// // SolarScene.jsx
// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// import { use } from "react";

// export default function SolarScene() {
//   const mountRef = useRef(null);
//   const initialized = useRef(false);
//   const textureLoader = new THREE.TextureLoader();

//   function createPlanetSystem({
//     radius,
//     textureURL,
//     color,
//     distance,
//     segments = 32
//   }) {
//     const orbitGroup = new THREE.Group();

//     const geometry = new THREE.SphereGeometry(radius, segments, segments);

//     let material;
//     if (textureURL) {
//       const texture = textureLoader.load(textureURL);
//       texture.colorSpace = THREE.SRGBColorSpace;
//       material = new THREE.MeshStandardMaterial({ map: texture });
//     } else {
//       material = new THREE.MeshStandardMaterial({ color });
//     }

//     const planet = new THREE.Mesh(geometry, material);
//     planet.position.x = distance;
//     orbitGroup.add(planet);

//     return { orbitGroup, planet };
//   }

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     // Set up scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x000000);

//     // Camera
//     const camera = new THREE.PerspectiveCamera(
//       60,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 10, 25);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(
//       mountRef.current.clientWidth,
//       mountRef.current.clientHeight
//     );
//     renderer.colorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 8;
//     mountRef.current.appendChild(renderer.domElement);

//     // Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     // Sun
//     const sunTexture = textureLoader.load("/textures/sun.jpg");
//     sunTexture.colorSpace = THREE.SRGBColorSpace;
//     const sunSurfaceMaterial = new THREE.MeshStandardMaterial({
//       map: sunTexture,
//       color: 0xffffff,
//       emissive: 0xffaa00,
//       emissiveIntensity: 0.15
//     });

//     const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
//     const sunSurface = new THREE.Mesh(sunGeometry, sunSurfaceMaterial);
//     scene.add(sunSurface);

//     const sunLight = new THREE.PointLight(0xffffff, 8, 200);
//     sunLight.position.set(0, 0, 0);
//     sunSurface.add(sunLight);

//     // Earth
//     const earthSystem = createPlanetSystem({
//       radius: 0.3,
//       textureURL: "/textures/earth.jpg",
//       distance: 5
//     });
//     scene.add(earthSystem.orbitGroup);

//     const moonSystem = createPlanetSystem({
//       radius: 0.05,
//       textureURL: "/textures/moon.jpg",
//       distance: 0.6,
//     });
//     moonSystem.orbitGroup.position.copy(earthSystem.planet.position);
//     earthSystem.orbitGroup.add(moonSystem.orbitGroup);

//     // Resize handling
//     const handleResize = () => {
//       const width = mountRef.current.clientWidth;
//       const height = mountRef.current.clientHeight;

//       renderer.setSize(width, height);
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//     };

//     window.addEventListener("resize", handleResize);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);

//       // Rotate planets
//       sunSurface.rotation.y += 0.001;

//       earthSystem.planet.rotation.y += 0.01;
//       earthSystem.orbitGroup.rotation.y += 0.002;
//       moonSystem.orbitGroup.rotation.y += 0.02;
//     };

//     animate();

//     // Cleanup on unmount
//     return () => {
//       if (mountRef.current && renderer.domElement) {
//         window.removeEventListener("resize", handleResize);
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <div
//       ref={mountRef}
//       style={{
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden"
//       }}
//     />
//   );
// }
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { initSolarScene } from "./three/initSolarScene";
import createPlanetSystem from "./three/createPlanetSystem";
import { startAnimation } from "./three/animate";

export default function SolarScene() {
  const mountRef = useRef(null);

  useEffect(() => {
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
    
    const earthSystem = createPlanetSystem({
      radius: 0.3,
      textureURL: "/textures/earth.jpg",
      distance: 5
    });
    scene.add(earthSystem.orbitGroup);

    const moonSystem = createPlanetSystem({
      radius: 0.05,
      textureURL: "/textures/moon.jpg",
      distance: 0.6,
    });
    moonSystem.orbitGroup.position.copy(earthSystem.planet.position);
    earthSystem.orbitGroup.add(moonSystem.orbitGroup);

    const systems = [
      { planet: earthSystem.planet, orbitGroup: earthSystem.orbitGroup, rotationSpeed: 0.01, orbitSpeed: 0.002 },
      { planet: moonSystem.planet, orbitGroup: moonSystem.orbitGroup, rotationSpeed: 0.02, orbitSpeed: 0.02 }
    ];

    startAnimation({ renderer, scene, camera, controls, systems });

    return () => {
      cleanup();
    }
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