import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeonBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 5, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05081b, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x00fff5, 0.5);
    const spot = new THREE.SpotLight(0xff00d0, 2);
    spot.position.set(10, 15, 10);
    spot.castShadow = true;
    scene.add(ambient, spot);

    // --- Create Neon Road ---
    const roadGeometry = new THREE.PlaneGeometry(40, 200, 20, 20);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x060d1f,
      emissive: 0x00ffd5,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Road stripes
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    for (let i = -50; i < 50; i += 5) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.01, 2),
        stripeMaterial
      );
      stripe.position.set(0, 0.01, i * 2);
      scene.add(stripe);
    }

    // --- Futuristic Cars ---
    const carGeometry = new THREE.BoxGeometry(3, 1, 5);
    const car1Material = new THREE.MeshStandardMaterial({
      color: 0x00ffd5,
      emissive: 0x00ffd5,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });
    const car2Material = new THREE.MeshStandardMaterial({
      color: 0xff00d0,
      emissive: 0xff00d0,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });

    const car1 = new THREE.Mesh(carGeometry, car1Material);
    const car2 = new THREE.Mesh(carGeometry, car2Material);
    car1.position.set(-4, 0.6, 0);
    car2.position.set(4, 0.6, -5);
    scene.add(car1, car2);

    // --- Drivers (simple glowing capsules) ---
    const driverGeo = new THREE.CapsuleGeometry(0.4, 1.5, 4, 8);
    const driverMat1 = new THREE.MeshStandardMaterial({
      emissive: 0x00ffff,
      emissiveIntensity: 1.0,
      color: 0x00aaff,
    });
    const driverMat2 = new THREE.MeshStandardMaterial({
      emissive: 0xff00ff,
      emissiveIntensity: 1.0,
      color: 0xaa00ff,
    });

    const driver1 = new THREE.Mesh(driverGeo, driverMat1);
    const driver2 = new THREE.Mesh(driverGeo, driverMat2);
    driver1.position.set(-4, 1.8, 2.5);
    driver2.position.set(4, 1.8, -7.5);
    scene.add(driver1, driver2);

    // Camera movement
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.01;
      car1.position.z = Math.sin(t) * 2;
      car2.position.z = Math.cos(t) * 2 - 5;
      driver1.rotation.y += 0.01;
      driver2.rotation.y -= 0.01;
      camera.lookAt(0, 1.5, 0);
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
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
        width: "100%",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
}