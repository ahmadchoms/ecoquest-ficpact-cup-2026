import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function TrophyScene() {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 1, 9);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // --- MATERIALS ---
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      metalness: 1,
      roughness: 0.15,
      emissive: 0xffaa00,
      emissiveIntensity: 0.1
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.9, // Glass effect
      transparent: true,
      thickness: 0.5
    });

    // --- GEOMETRY (Procedural Trophy) ---
    const trophyGroup = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, goldMaterial);
    base.position.y = -2;
    trophyGroup.add(base);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.3, 0.5, 2, 16);
    const stem = new THREE.Mesh(stemGeo, goldMaterial);
    stem.position.y = -0.8;
    trophyGroup.add(stem);

    // Cup Body (Bot half)
    const cupBaseGeo = new THREE.SphereGeometry(1.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cupBase = new THREE.Mesh(cupBaseGeo, goldMaterial);
    cupBase.position.y = 0.5;
    cupBase.rotation.x = Math.PI;
    trophyGroup.add(cupBase);

    // Cup Rim (Top half)
    const cupRimGeo = new THREE.TorusGeometry(1.4, 0.1, 16, 32);
    const cupRim = new THREE.Mesh(cupRimGeo, goldMaterial);
    cupRim.position.y = 1.9;
    cupRim.rotation.x = Math.PI / 2;
    trophyGroup.add(cupRim);

    // Floating Gem/Star inside
    const starGeo = new THREE.IcosahedronGeometry(0.8, 0);
    const star = new THREE.Mesh(starGeo, glassMaterial);
    star.position.y = 2.5;
    trophyGroup.add(star);

    // Floating particles (Confetti)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 50;
    const posArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    const colorPalette = [new THREE.Color(0xfbbf24), new THREE.Color(0x34d399), new THREE.Color(0xf472b6)];

    for(let i = 0; i < particleCount; i++) {
       posArray[i * 3] = (Math.random() - 0.5) * 6;
       posArray[i * 3 + 1] = (Math.random() - 0.5) * 6;
       posArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

       const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
       colorsArray[i * 3] = color.r;
       colorsArray[i * 3 + 1] = color.g;
       colorsArray[i * 3 + 2] = color.b;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particlesMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    const confetti = new THREE.Points(particlesGeo, particlesMat);
    trophyGroup.add(confetti);

    scene.add(trophyGroup);

    // --- LIGHTING ---
    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);

    const spotLight = new THREE.SpotLight(0xffaa00, 5);
    spotLight.position.set(5, 5, 5);
    spotLight.angle = 0.5;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    const rimLight = new THREE.PointLight(0xffffff, 2);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // ANIMATION
    let requestID;
    const animate = (time) => {
      requestID = requestAnimationFrame(animate);

      // Trophy float & rotate
      trophyGroup.rotation.y = Math.sin(time * 0.0005) * 0.2;
      trophyGroup.position.y = Math.sin(time * 0.001) * 0.2;

      // Star spin
      star.rotation.y += 0.01;
      star.rotation.z += 0.005;

      // Confetti slow drift
      confetti.rotation.y -= 0.001;

      renderer.render(scene, camera);
    };

    setIsLoaded(true);
    animate(0);

    // RESIZE
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestID);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      baseGeo.dispose();
      stemGeo.dispose();
      cupBaseGeo.dispose();
      cupRimGeo.dispose();
      starGeo.dispose();
      particlesGeo.dispose();
      goldMaterial.dispose();
      glassMaterial.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full relative" style={{ minHeight: 180 }}>
      {/* Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 z-0" />
      
      {/* Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        </div>
      )}
    </div>
  );
}


