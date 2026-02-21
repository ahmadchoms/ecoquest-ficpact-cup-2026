"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function TrophyScene() {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      40,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, -0.5, 8);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Peningkatan Tone Mapping untuk warna emas yang lebih kaya
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;

    const container = mountRef.current;
    container.appendChild(renderer.domElement);

    // --- MATERIALS (DI-UPGRADE) ---
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffaa00, // Warna emas dibuat sedikit lebih hangat
      metalness: 1.0,
      roughness: 0.15, // Sedikit dinaikkan agar cahaya menyebar lebih halus
      emissive: 0x331a00, // Emissive hangat untuk mencegah bayangan terlalu hitam pekat
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    // Material baru untuk dudukan (Base) - Hitam mengkilap/Marmer
    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.6,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
    });

    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f2ff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95,
      transparent: true,
      thickness: 1.5,
      ior: 2.4,
    });

    // --- GEOMETRY (DI-UPGRADE) ---
    const trophyGroup = new THREE.Group();

    // 1. Base (Dibuat lebih berat dan menggunakan material gelap)
    const baseBottomGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32);
    const baseBottom = new THREE.Mesh(baseBottomGeo, baseMaterial);
    baseBottom.position.y = -2.5;
    trophyGroup.add(baseBottom);

    const baseTopGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.4, 32);
    const baseTop = new THREE.Mesh(baseTopGeo, baseMaterial);
    baseTop.position.y = -2.15;
    trophyGroup.add(baseTop);

    // 2. Stem (Lebih ramping dan panjang, seperti trofi modern)
    const stemGeo = new THREE.CylinderGeometry(0.15, 0.4, 1.8, 32);
    const stem = new THREE.Mesh(stemGeo, goldMaterial);
    stem.position.y = -1.05;
    trophyGroup.add(stem);

    // [BARU] Cincin Leher (Penyambung mulus antara batang dan piala)
    const neckRingGeo = new THREE.TorusGeometry(0.25, 0.08, 16, 32);
    const neckRing = new THREE.Mesh(neckRingGeo, goldMaterial);
    neckRing.position.y = -0.15;
    neckRing.rotation.x = Math.PI / 2;
    trophyGroup.add(neckRing);

    // 3. Cup Body (Diubah dari mangkuk menjadi bentuk piala/chalice)
    const cupBaseGeo = new THREE.SphereGeometry(
      1.2, // Radius sedikit dikecilkan
      32,
      32,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.55, // Sedikit lebih dalam dari setengah bola
    );
    const cupBase = new THREE.Mesh(cupBaseGeo, goldMaterial);
    cupBase.position.y = -0.15;
    cupBase.rotation.x = Math.PI; // Balik ke atas
    cupBase.scale.y = 1.4; // [KUNCI] Ditarik ke atas agar berbentuk piala elegan, bukan mangkuk
    trophyGroup.add(cupBase);

    // 4. Handles (Lebih ramping dan menyatu dengan kurva piala)
    const handleGeo = new THREE.TorusGeometry(0.7, 0.08, 16, 32, Math.PI); // Torus setengah lingkaran

    const handleLeft = new THREE.Mesh(handleGeo, goldMaterial);
    handleLeft.position.set(-1.1, 0.6, 0);
    handleLeft.rotation.z = Math.PI / 2 + 0.2; // Dimiringkan agar mengikuti lengkungan piala
    trophyGroup.add(handleLeft);

    const handleRight = new THREE.Mesh(handleGeo, goldMaterial);
    handleRight.position.set(1.1, 0.6, 0);
    handleRight.rotation.z = -Math.PI / 2 - 0.2;
    trophyGroup.add(handleRight);

    // 5. Gem (Pusat perhatian diletakkan di dalam piala)
    const starGeo = new THREE.OctahedronGeometry(0.5, 0);
    const star = new THREE.Mesh(starGeo, gemMaterial);
    star.position.y = 1.4; // Melayang pas di atas bibir piala
    trophyGroup.add(star);

    // 6. Confetti (Tetap sama, efek partikel)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 80;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 10;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 10 + 2; // Mulai lebih tinggi
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );
    const particlesMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffd700,
      transparent: true,
      opacity: 0.8,
    });
    const confetti = new THREE.Points(particlesGeo, particlesMat);
    scene.add(confetti);

    scene.add(trophyGroup);

    // --- LIGHTING (DI-UPGRADE) ---
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(2, 5, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00f2ff, 3, 10);
    blueLight.position.set(0, 1.2, 1);
    scene.add(blueLight);

    const goldBacklight = new THREE.PointLight(0xffaa00, 2, 10);
    goldBacklight.position.set(-2, -2, -2);
    scene.add(goldBacklight);

    // ANIMATION
    let requestID;
    let hasSetLoaded = false;

    const animate = (time) => {
      // Set loaded state inside animation frame (not synchronously in effect)
      if (!hasSetLoaded) {
        setIsLoaded(true);
        hasSetLoaded = true;
      }

      requestID = requestAnimationFrame(animate);

      const t = time * 0.001;

      // Floating motion
      trophyGroup.position.y = Math.sin(t) * 0.15;
      trophyGroup.rotation.y = t * 0.3;

      // Gem pulse & spin
      star.rotation.y -= 0.02;
      star.scale.setScalar(1 + Math.sin(t * 2) * 0.1);

      // Slow particles drift
      confetti.rotation.y += 0.002;
      confetti.position.y = Math.sin(t * 0.5) * 0.2;

      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(requestID);
      renderer.dispose();
      // Dispose Geometries
      [
        baseBottomGeo,
        baseTopGeo,
        stemGeo,
        cupBaseGeo,
        handleGeo,
        starGeo,
        particlesGeo,
      ].forEach((g) => g.dispose());
      // Dispose Materials
      [goldMaterial, gemMaterial, particlesMat].forEach((m) => m.dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative group" style={{ minHeight: 50 }}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-full blur-3xl" />

      <div ref={mountRef} className="w-full h-full absolute inset-0 z-10" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-amber-200 uppercase tracking-widest font-bold">
          Master Guardian Trophy
        </div>
      </div>
    </div>
  );
}
