import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function initSolarScene(container) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 10, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.colorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 8;
    container.appendChild(renderer.domElement);

    const observer = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    observer.observe(container);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    return { 
        scene,
        camera,
        renderer,
        controls,
        cleanup: () => {
            observer.disconnect();
            renderer.dispose();
        }
     };

}