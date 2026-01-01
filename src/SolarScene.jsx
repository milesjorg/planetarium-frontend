// SolarScene.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function SolarScene() {
  const mountRef = useRef(null);
  const initialized = useRef(false);

  function createPlanet({
    radius,
    color,
    distance = 0,
    segments = 32
  }) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = distance;
    return mesh;
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 25);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Ambient Lights
    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambient);

    // Sun
    const sun = createPlanet({ radius: 1, color: 0xffcc00 });
    scene.add(sun);

    const sunLight = new THREE.PointLight(0xffffff, 3, 0);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Mercury
    const mercury = createPlanet({
      radius: 0.038,
      color: 0xaaaaaa,
      distance: 2
    });
    scene.add(mercury);

    // Earth
    const earth = createPlanet({
      radius: 0.1,
      color: 0x3366ff,
      distance: 3
    });
    scene.add(earth);

    // Resize handling
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      // Rotate planets
      sun.rotation.y += 0.001;
      mercury.rotation.y += 0.005;
      earth.rotation.y += 0.01;

      // Orbit planets
      const time = Date.now() * 0.001;
      mercury.position.x = Math.cos(time * 4) * 2;
      mercury.position.z = Math.sin(time * 4) * 2;
      earth.position.x = Math.cos(time * 2) * 3;
      earth.position.z = Math.sin(time * 2) * 3;
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (mountRef.current && renderer.domElement) {
        window.removeEventListener("resize", handleResize);
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
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
