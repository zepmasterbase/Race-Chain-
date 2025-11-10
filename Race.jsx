import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLocation, useNavigate } from "react-router-dom";
import HUDOverlay from "../components/HUDOverlay";
import "./race.css";

/**
 * Simple 3D race demo:
 * - Player car: WASD / Arrow Keys
 * - AI car: follows the same track with slight speed variance
 * - Timer: 60 seconds
 * - Laps: computed from distance / lapLength
 * - Position: 1st or 2nd based on distance along lap
 */

export default function Race() {
  const mountRef = useRef(null);
  const animationRef = useRef();
  const navigate = useNavigate();
  const { state } = useLocation(); // comes from Garage navigate("/race", { state: { selectedCar } })
  const selectedCar = state?.selectedCar || { name: "Lancer V1" };

  // HUD states
  const [timeLeft, setTimeLeft] = useState(60);
  const [speed, setSpeed] = useState(0);
  const [lap, setLap] = useState(1);
  const totalLaps = 3;
  const [position, setPosition] = useState(1);

  // Input states
  const keys = useRef({
    up: false, down: false, left: false, right: false
  });

  // Physics/basic params
  const maxSpeed = 120;            // km/h (visual)
  const accel = 55;                // km/h per second
  const brakePower = 95;           // km/h per second
  const turnRate = 1.8;            // radians/sec at full lock
  const drag = 18;                 // km/h per second (friction)
  const lapLength = 1000;          // arbitrary distance units per lap

  // runtime objects
  const objectsRef = useRef({
    scene: null, camera: null, renderer: null,
    player: null, ai: null, track: null, clock: null
  });

  // distance trackers
  const dist = useRef({ player: 0, ai: 0 });
  const yaw = useRef({ player: 0 });   // heading radians
  const vel = useRef({ player: 0, ai: 0 }); // km/h-ish visual
  const lastTime = useRef(0);

  // ------- Setup & Teardown -------
  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05081b);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      65, window.innerWidth / window.innerHeight, 0.1, 2000
    );
    camera.position.set(0, 5, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x66fff5, 0.45);
    const dir = new THREE.DirectionalLight(0xff00d0, 1.3);
    dir.position.set(12, 20, 10);
    scene.add(ambient, dir);

    // Ground grid (neon)
    const grid = new THREE.GridHelper(400, 80, 0x00ffd5, 0x00ffd5);
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    scene.add(grid);

    // Neon track ring (visual cue)
    const ringGeo = new THREE.TorusGeometry(60, 0.2, 16, 200);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffd5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    // Player car
    const player = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.6, 3),
      new THREE.MeshStandardMaterial({
        color: 0x00ffd5,
        emissive: 0x00ffd5,
        emissiveIntensity: 0.7,
        metalness: 0.8,
        roughness: 0.25
      })
    );
    player.position.set(0, 0.6, 0);
    scene.add(player);

    // AI car
    const ai = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.6, 3),
      new THREE.MeshStandardMaterial({
        color: 0xff00d0,
        emissive: 0xff00d0,
        emissiveIntensity: 0.7,
        metalness: 0.8,
        roughness: 0.25
      })
    );
    ai.position.set(0, 0.6, -5);
    scene.add(ai);

    // Fake "neon road" under the cars
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({
        color: 0x071326,
        emissive: 0x061a2e,
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.8,
        side: THREE.DoubleSide
      })
    );
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Store objects
    objectsRef.current = {
      scene, camera, renderer, player, ai, track: ring, clock: new THREE.Clock()
    };

    // Input listeners
    const down = (e) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = true;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = true;
    };
    const up = (e) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = false;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Start anim loop
    lastTime.current = performance.now();
    animationRef.current = requestAnimationFrame(loop);

    // Timer countdown (HUD)
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          // End race
          setTimeout(() => {
            endRace();
          }, 200);
        }
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------- Main Loop -------
  const loop = (now) => {
    const { scene, camera, renderer, player, ai } = objectsRef.current;
    if (!renderer) return;

    const dt = Math.min((now - lastTime.current) / 1000, 0.033); // clamp dt
    lastTime.current = now;

    // Update player velocity (km/h-like)
    let v = vel.current.player;
    if (keys.current.up) v += accel * dt;
    if (keys.current.down) v -= brakePower * dt;
    // drag/friction
    if (!keys.current.up && !keys.current.down) {
      if (v > 0) v = Math.max(0, v - drag * dt);
      if (v < 0) v = Math.min(0, v + drag * dt);
    }
    v = THREE.MathUtils.clamp(v, 0, maxSpeed);
    vel.current.player = v;
    setSpeed(v);

    // Turning
    const turning = (keys.current.left ? -1 : 0) + (keys.current.right ? 1 : 0);
    yaw.current.player += turning * turnRate * dt * (0.6 + v / maxSpeed); // turn more at speed

    // Move player forward along heading (simple flat plane physics)
    const forward = new THREE.Vector3(
      Math.sin(yaw.current.player), 0, Math.cos(yaw.current.player)
    );
    const metersPerSecond = (v * 1000) / 3600; // convert km/h to m/s visual
    player.position.add(forward.clone().multiplyScalar(metersPerSecond * dt));

    // Accumulate "distance" for lap calc
    dist.current.player += metersPerSecond * dt * 10; // scaled for lapLength
    const playerLapFloat = dist.current.player / lapLength;
    const newLap = Math.min(totalLaps, Math.floor(playerLapFloat) + 1);
    if (newLap !== lap) setLap(newLap);

    // AI logic: simple pace with small oscillation
    const aiBase = 80; // base km/h
    const aiOsc = Math.sin(now * 0.001) * 10; // small speed changes
    vel.current.ai = THREE.MathUtils.clamp(aiBase + aiOsc, 0, 140);
    const aiMps = (vel.current.ai * 1000) / 3600;
    // Put AI on a big circular path
    const aiAngle = (dist.current.ai / lapLength) * Math.PI * 2;
    dist.current.ai += aiMps * dt * 10;
    ai.position.set(Math.sin(aiAngle) * 30, 0.6, Math.cos(aiAngle) * 30);
    ai.rotation.y = -aiAngle + Math.PI;

    // Simple player ring clamp: keep near the ring radius
    const radius = 30;
    const pVec = new THREE.Vector3(player.position.x, 0, player.position.z);
    const len = pVec.length();
    if (len > radius + 10) {
      // nudge back in
      const dir = pVec.clone().normalize().multiplyScalar(-1);
      player.position.add(dir.multiplyScalar(5 * dt));
    }

    // Orient player to its heading
    player.rotation.y = Math.PI - yaw.current.player;

    // Chase camera
    const camOffset = new THREE.Vector3(0, 5, 12);
    const camPos = player.position
      .clone()
      .add(
        new THREE.Vector3(
          -Math.sin(yaw.current.player) * camOffset.z,
          camOffset.y,
          -Math.cos(yaw.current.player) * camOffset.z
        )
      );
    camera.position.lerp(camPos, 0.1);
    camera.lookAt(player.position.clone().add(new THREE.Vector3(0, 1.5, 0)));

    // Position (1st / 2nd) based on distance
    const playerProgress = dist.current.player % (lapLength * totalLaps);
    const aiProgress = dist.current.ai % (lapLength * totalLaps);
    setPosition(playerProgress >= aiProgress ? 1 : 2);

    renderer.render(scene, camera);
    animationRef.current = requestAnimationFrame(loop);
  };

  // ------- End Race -------
  const endRace = () => {
    // Simple result dialog for now
    const youWon = position === 1;
    const msg = youWon
      ? "🏁 You finished 1st! +20 $RACE (mock)"
      : "🏁 You finished 2nd. Try again!";
    alert(msg);
    navigate("/garage");
  };

  return (
    <div className="race-wrapper">
      <div ref={mountRef} className="race-canvas" />
      <HUDOverlay
        timeLeft={timeLeft}
        speed={speed}
        lap={lap}
        totalLaps={totalLaps}
        position={position}
        playerCar={selectedCar?.name || "Lancer V1"}
        playerName="You"
      />
    </div>
  );
}