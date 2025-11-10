import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeonBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05081b, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x00ffff, 0.3);
    const point = new THREE.PointLight(0xff00ff, 2, 100);
    point.position.set(0, 15, 10);
    scene.add(ambient, point);

    // Ground grid for effect
    const grid = new THREE.GridHelper(200, 40, 0x00ffd5, 0x00ffd5);
    scene.add(grid);

    // Neon city blocks
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const buildings = [];

    for (let i = 0; i < 250; i++) {
      const material = new THREE.MeshPhongMaterial({
        emissive: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 60%)`),
        emissiveIntensity: 0.8,
        color: 0x111111,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 5,
        (Math.random() - 0.5) * 100
      );
      cube.scale.y = Math.random() * 10 + 1;
      scene.add(cube);
      buildings.push(cube);
    }

    // Camera placement
    camera.position.z = 40;
    camera.position.y = 10;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      buildings.forEach((b) => {
        b.rotation.y += 0.002;
      });
      camera.position.x = Math.sin(Date.now() * 0.0003) * 20;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Canvas container
  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}