"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type OrbitalCanvasMode = "hero" | "story" | "ambient" | "final";

type OrbitalCanvasProps = {
  mode: OrbitalCanvasMode;
  progress?: number;
  progressSource?: { current: number };
  className?: string;
};

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorld;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorld = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform float uTime;
  uniform float uAtmosphere;
  varying vec3 vNormal;
  varying vec3 vWorld;

  float field(vec3 p) {
    float a = sin(p.x * 5.6 + p.y * 1.4 + uTime * 0.06);
    float b = sin(p.y * 8.2 - p.z * 4.0);
    float c = sin((p.x + p.z) * 11.0 + cos(p.y * 3.0));
    return (a + b * 0.65 + c * 0.34) / 1.99;
  }

  void main() {
    float contour = field(normalize(vWorld));
    float land = smoothstep(0.11, 0.42, contour);
    float frost = smoothstep(0.62, 0.92, abs(normalize(vWorld).y));
    float light = smoothstep(-0.18, 0.88, dot(normalize(vNormal), normalize(vec3(-0.38, 0.22, 0.9))));
    float limb = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.55);

    vec3 ocean = vec3(0.025, 0.092, 0.145);
    vec3 deep = vec3(0.004, 0.014, 0.025);
    vec3 landColor = vec3(0.075, 0.145, 0.128);
    vec3 ice = vec3(0.63, 0.75, 0.78);
    vec3 glow = vec3(0.30, 0.74, 0.92);

    vec3 color = mix(deep, ocean, light);
    color = mix(color, landColor, land * 0.48 * light);
    color = mix(color, ice, frost * 0.32 * light);
    color += glow * limb * (0.18 + uAtmosphere * 0.42);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform float uIntensity;
  varying vec3 vNormal;

  void main() {
    float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.15);
    vec3 color = vec3(0.25, 0.78, 0.96);
    gl_FragColor = vec4(color, rim * uIntensity);
  }
`;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function seededRandom(seed = 19) {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function orbitGeometry(radiusX: number, radiusY: number, start = 0, end = Math.PI * 2, segments = 360) {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const t = start + (end - start) * (index / segments);
    points.push(new THREE.Vector3(Math.cos(t) * radiusX, Math.sin(t) * radiusY, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function pointOnOrbit(radiusX: number, radiusY: number, progress: number, start = -1.1, end = 2.7) {
  const t = start + (end - start) * progress;
  return new THREE.Vector3(Math.cos(t) * radiusX, Math.sin(t) * radiusY, 0);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const disposable = child as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };

    disposable.geometry?.dispose();

    if (Array.isArray(disposable.material)) {
      disposable.material.forEach((material) => material.dispose());
    } else {
      disposable.material?.dispose();
    }
  });
}

export function OrbitalCanvas({ mode, progress = 0, progressSource, className = "" }: OrbitalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localProgressRef = useRef(clamp01(progress));
  const renderOnceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    localProgressRef.current = clamp01(progress);
    renderOnceRef.current?.();
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const root = new THREE.Group();
    const earthGroup = new THREE.Group();
    const orbitGroup = new THREE.Group();
    const passRig = new THREE.Group();
    scene.add(root);
    root.add(earthGroup, orbitGroup, passRig);

    const random = seededRandom(mode.length * 97);
    const starCount = mode === "ambient" ? 560 : 900;
    const starPositions = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount; index += 1) {
      const radius = 18 + random() * 32;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[index * 3 + 2] = radius * Math.cos(phi);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xdcefff,
      size: mode === "ambient" ? 0.017 : 0.021,
      transparent: true,
      opacity: mode === "ambient" ? 0.24 : 0.34,
      depthWrite: false
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const earthGeometry = new THREE.SphereGeometry(1, 128, 96);
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAtmosphere: { value: mode === "ambient" ? 0.55 : 0.9 }
      }
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(1.045, 128, 96);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: atmosphereFragmentShader,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uIntensity: { value: mode === "ambient" ? 0.32 : 0.58 }
      }
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xa9c6d8,
      transparent: true,
      opacity: mode === "ambient" ? 0.11 : 0.18,
      depthWrite: false
    });

    [
      [2.42, 0.9, 0.72, 0.08, -0.48],
      [2.16, 0.82, -0.55, 0.1, 0.36],
      [2.68, 1.02, 0.35, -0.24, 0.72]
    ].forEach(([rx, ry, rotX, rotY, rotZ]) => {
      const line = new THREE.Line(orbitGeometry(rx, ry), orbitMaterial.clone());
      line.rotation.set(rotX, rotY, rotZ);
      orbitGroup.add(line);
    });

    const passGeometry = orbitGeometry(2.25, 0.86, -1.1, 2.7, 260);
    const passMaterial = new THREE.LineBasicMaterial({
      color: 0x86efff,
      transparent: true,
      opacity: mode === "ambient" ? 0.34 : 0.78,
      depthWrite: false
    });
    const passArc = new THREE.Line(passGeometry, passMaterial);
    passArc.rotation.set(0.74, -0.2, -0.42);
    passRig.add(passArc);

    const passGlowMaterial = new THREE.LineBasicMaterial({
      color: 0x48d2ff,
      transparent: true,
      opacity: mode === "ambient" ? 0.08 : 0.18,
      depthWrite: false
    });
    const passGlow = new THREE.Line(passGeometry.clone(), passGlowMaterial);
    passGlow.scale.setScalar(1.012);
    passGlow.rotation.copy(passArc.rotation);
    passRig.add(passGlow);

    const satelliteMaterial = new THREE.MeshBasicMaterial({
      color: 0xeafcff,
      transparent: true,
      opacity: 0.95
    });
    const satelliteGeometry = new THREE.SphereGeometry(0.026, 18, 18);
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.rotation.copy(passArc.rotation);
    passRig.add(satellite);

    const smallLightGeometry = new THREE.SphereGeometry(0.015, 12, 12);
    for (let index = 0; index < 5; index += 1) {
      const light = new THREE.Mesh(
        smallLightGeometry,
        new THREE.MeshBasicMaterial({
          color: index % 2 === 0 ? 0xb8e9ff : 0xf1fbff,
          transparent: true,
          opacity: mode === "ambient" ? 0.28 : 0.44
        })
      );
      const point = pointOnOrbit(2.1 + index * 0.08, 0.78 + index * 0.04, (index + 1) / 7, -2.4, 2.9);
      light.position.copy(point);
      light.rotation.set(0.5 - index * 0.12, index * 0.18, -0.2 + index * 0.08);
      orbitGroup.add(light);
    }

    let width = 1;
    let height = 1;
    let narrow = false;
    let frameId: number | null = null;
    let paused = false;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      narrow = width < 760;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderOnceRef.current?.();
    };

    const render = (time: number) => {
      const seconds = time * 0.001;
      const p = clamp01(progressSource?.current ?? localProgressRef.current);
      const drift = prefersReducedMotion ? 0 : seconds;
      const aspect = width / Math.max(1, height);

      stars.rotation.y = drift * 0.006;
      stars.rotation.x = -0.08 + drift * 0.002;

      earthMaterial.uniforms.uTime.value = seconds;
      earthMaterial.uniforms.uAtmosphere.value = mode === "story" ? 0.65 + p * 0.58 : mode === "final" ? 0.72 : mode === "ambient" ? 0.42 : 0.88;
      atmosphereMaterial.uniforms.uIntensity.value = mode === "story" ? 0.28 + p * 0.54 : mode === "ambient" ? 0.24 : 0.48;

      earthGroup.rotation.y = drift * 0.035 + p * 1.4;
      earthGroup.rotation.x = -0.18 + p * 0.16;
      orbitGroup.rotation.y = drift * 0.025 + p * 0.9;
      orbitGroup.rotation.z = -0.08 + p * 0.18;
      passRig.rotation.y = p * 0.28;

      if (mode === "hero") {
        camera.position.set(0.18, 0.08, 6.2);
        earthGroup.position.set(narrow ? 0.58 : 1.48 * Math.min(aspect, 1.5), narrow ? -0.74 : -0.52, -0.35);
        earthGroup.scale.setScalar(narrow ? 1.74 : 2.04);
        orbitGroup.position.copy(earthGroup.position);
        orbitGroup.scale.setScalar(narrow ? 1.18 : 1.38);
        passRig.position.copy(earthGroup.position);
        passRig.scale.setScalar(narrow ? 1.14 : 1.34);
      } else if (mode === "story") {
        camera.position.set(Math.sin(p * 1.45) * 0.72, 0.28 - p * 0.34, 5.85 - p * 1.1);
        earthGroup.position.set(narrow ? 0.12 : 0.26, -0.08 - p * 0.08, 0);
        earthGroup.scale.setScalar(narrow ? 1.22 + p * 0.34 : 1.56 + p * 0.42);
        orbitGroup.position.copy(earthGroup.position);
        orbitGroup.scale.setScalar(narrow ? 0.72 + p * 0.2 : 0.95 + p * 0.3);
        passRig.position.copy(earthGroup.position);
        passRig.scale.setScalar(narrow ? 0.74 + p * 0.22 : 0.98 + p * 0.34);
      } else if (mode === "final") {
        camera.position.set(0, 0.08, 6.6);
        earthGroup.position.set(0, narrow ? -1.14 : -1.28, -0.35);
        earthGroup.scale.setScalar(narrow ? 1.46 : 1.82);
        orbitGroup.position.copy(earthGroup.position);
        orbitGroup.scale.setScalar(narrow ? 0.92 : 1.18);
        passRig.position.copy(earthGroup.position);
        passRig.scale.setScalar(narrow ? 0.9 : 1.16);
      } else {
        camera.position.set(0.12, 0.04, 6.3);
        earthGroup.position.set(narrow ? 0.68 : 1.64 * Math.min(aspect, 1.55), narrow ? -0.46 : -0.28, -0.5);
        earthGroup.scale.setScalar(narrow ? 1.12 : 1.52);
        orbitGroup.position.copy(earthGroup.position);
        orbitGroup.scale.setScalar(narrow ? 0.72 : 0.95);
        passRig.position.copy(earthGroup.position);
        passRig.scale.setScalar(narrow ? 0.7 : 0.92);
      }

      camera.lookAt(0, mode === "final" ? -0.35 : -0.06, 0);

      const visiblePoints = Math.max(2, Math.floor(262 * (mode === "story" ? p : mode === "hero" ? 0.68 : 0.82)));
      passGeometry.setDrawRange(0, visiblePoints);
      passGlow.geometry.setDrawRange(0, visiblePoints);

      const satelliteProgress = mode === "story" ? p : (0.52 + Math.sin(drift * 0.22) * 0.12);
      satellite.position.copy(pointOnOrbit(2.25, 0.86, clamp01(satelliteProgress)));
      satellite.scale.setScalar(mode === "ambient" ? 0.72 : 1);

      renderer.render(scene, camera);
    };

    renderOnceRef.current = () => render(performance.now());

    const animate = (time: number) => {
      if (!paused) render(time);
      frameId = window.requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      paused = document.hidden;
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    if (!prefersReducedMotion) {
      frameId = window.requestAnimationFrame(animate);
    } else {
      render(performance.now());
    }

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      renderOnceRef.current = null;
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [mode, progressSource]);

  return <canvas ref={canvasRef} className={className} data-orbital-canvas={mode} aria-hidden="true" />;
}
