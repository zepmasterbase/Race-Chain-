import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeonBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
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

    const ambient = new THREE.AmbientLight(0x00ffff, 0.2);
    const point = new THREE.PointLight(0x00fff0, 1, 50);
    point.position.set(0, 10, 10);
    scene.add(ambient, point);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const buildings = [];
    for (let i = 0; i < 300; i++) {
      const material = new THREE.MeshPhongMaterial({
        emissive: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 60%)`),
        emissiveIntensity: 1,
        color: 0x101010,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 5,
        (Math.random() - 0.5) * 100
      );
      cube.scale.y = Math.random() * 15 + 1;
      scene.add(cube);
      buildings.push(cube);
    }

    camera.position.z = 30;
    camera.position.y = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      buildings.forEach((b) => (b.rotation.y += 0.002));
      camera.position.x = Math.sin(Date.now() * 0.0003) * 20;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

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