"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Utility: generate procedural earth texture on canvas ───────────────────
// (Bagian ini TIDAK DIUBAH agar tekstur bumi tetap sama)
function createEarthCanvas() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Ocean base
  const ocean = ctx.createLinearGradient(0, 0, 0, size);
  ocean.addColorStop(0, "#0a3d62");
  ocean.addColorStop(0.4, "#1a6ea8");
  ocean.addColorStop(0.6, "#1e8bc3");
  ocean.addColorStop(1, "#0a3d62");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, size, size);

  // Helper: draw landmass blob
  function land(x, y, rx, ry, angle = 0, color = "#2d8a4e") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, color);
    g.addColorStop(0.7, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Rough approximation of continents ──────────────────────────
  land(170, 230, 80, 100, -0.2, "#3aaf5c");
  land(140, 300, 55, 70, 0.1, "#2d8a4e");
  land(160, 190, 50, 45, 0.0, "#45c06a");
  land(235, 420, 50, 95, 0.15, "#2d8a4e");
  land(225, 500, 40, 60, 0.1, "#27784a");
  land(490, 195, 45, 45, -0.1, "#3aaf5c");
  land(510, 175, 30, 30, 0.0, "#45c06a");
  land(490, 310, 65, 90, 0.05, "#3aaf5c");
  land(500, 390, 45, 60, 0.0, "#2d8a4e");
  land(630, 200, 130, 90, -0.05, "#3aaf5c");
  land(700, 160, 80, 60, 0.1, "#45c06a");
  land(720, 250, 70, 55, 0.0, "#2d8a4e");
  land(640, 140, 60, 40, 0.0, "#3aaf5c");
  land(740, 430, 60, 45, 0.1, "#c8a84b");
  land(760, 450, 40, 30, 0.0, "#b8942f");
  land(710, 330, 30, 20, -0.3, "#3aaf5c");
  land(740, 345, 20, 12, 0.1, "#45c06a");
  land(760, 340, 18, 10, 0.2, "#3aaf5c");
  land(775, 350, 22, 12, 0.0, "#45c06a");
  land(512, 940, 200, 80, 0.0, "#dce8f0");

  // Ice caps
  const iceN = ctx.createRadialGradient(size / 2, 0, 0, size / 2, 0, 120);
  iceN.addColorStop(0, "rgba(220,232,240,0.95)");
  iceN.addColorStop(1, "rgba(220,232,240,0)");
  ctx.fillStyle = iceN;
  ctx.fillRect(0, 0, size, 120);

  // Cloud layer (soft whites)
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 28; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const cr = 30 + Math.random() * 80;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cg.addColorStop(0, "rgba(255,255,255,0.9)");
    cg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cr, cr * 0.45, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  return canvas;
}

function createSpecularCanvas() {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#6699bb";
  ctx.fillRect(0, 0, size, size);
  return c;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EcoGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    // ── Renderer ─────────────────────────────────────────────────
    // alpha: true penting agar background transparan
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    // Set clear color to transparent
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      el.clientWidth / el.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5.5;

    // ── Earth ─────────────────────────────────────────────────────
    const earthTex = new THREE.CanvasTexture(createEarthCanvas());
    const specTex = new THREE.CanvasTexture(createSpecularCanvas());

    const earthGeo = new THREE.SphereGeometry(2, 80, 80);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTex,
      specularMap: specTex,
      specular: new THREE.Color(0x4488aa),
      shininess: 18,
      bumpScale: 0.03,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);
    scene.add(earth);

    // ── Atmosphere glow ───────────────────────────────────────────
    const atmGeo = new THREE.SphereGeometry(2.22, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float rim = pow(max(0.0, 0.7 - dot(vNormal, vec3(0.0,0.0,1.0))), 3.5);
          vec3 col = mix(vec3(0.05,0.45,0.9), vec3(0.1,0.85,0.55), rim);
          gl_FragColor = vec4(col, rim * 0.75);
        }
      `,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atmosphere);

    // ── Cloud layer ───────────────────────────────────────────────
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cctx = cloudCanvas.getContext("2d");
    cctx.fillStyle = "rgba(0,0,0,0)";
    cctx.fillRect(0, 0, 1024, 512);
    cctx.globalAlpha = 0.55;
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * 1024,
        cy = Math.random() * 512;
      const r = 20 + Math.random() * 70;
      const cg = cctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cg.addColorStop(0, "rgba(255,255,255,1)");
      cg.addColorStop(1, "rgba(255,255,255,0)");
      cctx.fillStyle = cg;
      cctx.beginPath();
      cctx.ellipse(cx, cy, r, r * 0.4, Math.random() * Math.PI, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    const cloudGeo = new THREE.SphereGeometry(2.04, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    // ── Lighting ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    const sunLight = new THREE.DirectionalLight(0xfff8e8, 2.2);
    sunLight.position.set(8, 4, 6);
    scene.add(sunLight);
    const fillLight = new THREE.PointLight(0x2244aa, 0.4, 20);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    // ── Mouse interaction (Hanya untuk rotasi) ────────────────────
    let targetRotY = 0;
    let dragActive = false,
      lastX = 0;
    const onMouseMove = (e) => {
      if (dragActive) {
        const dx = e.clientX - lastX;
        targetRotY += dx * 0.005;
        lastX = e.clientX;
      }
    };
    const onMouseDown = (e) => {
      dragActive = true;
      lastX = e.clientX;
    };
    const onMouseUp = () => {
      dragActive = false;
    };

    // Attach listener ke elemen mountRef
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // ── Animation ─────────────────────────────────────────────────
    let rafId,
      t = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.005;

      // Slow auto-rotation + drag interaction
      if (!dragActive) targetRotY += 0.0018;

      earth.rotation.y = targetRotY;
      clouds.rotation.y = targetRotY * 1.04 + t * 0.003;
      atmosphere.rotation.y = targetRotY * 0.5;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!el) return;
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mousedown", onMouseDown);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "grab",
        // Background transparan
        background: "transparent",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
