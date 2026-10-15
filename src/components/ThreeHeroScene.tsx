import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, EyeOff, RotateCw, Sparkles, Layers } from 'lucide-react';

interface ThreeHeroSceneProps {
  currentBand?: number;
  onExploreClick?: () => void;
}

export const ThreeHeroScene: React.FC<ThreeHeroSceneProps> = ({ currentBand = 7.5 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [hologramTheme, setHologramTheme] = useState<'cyan' | 'purple' | 'emerald'>('cyan');

  // Mutable refs to allow real-time control updates without re-instantiating scene
  const configRef = useRef({
    speed: 1,
    wireframe: false,
    theme: 'cyan' as 'cyan' | 'purple' | 'emerald'
  });

  useEffect(() => {
    configRef.current.speed = rotationSpeed;
    configRef.current.wireframe = wireframeMode;
    configRef.current.theme = hologramTheme;
  }, [rotationSpeed, wireframeMode, hologramTheme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050713, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Procedural Studio Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Lighting Rig (Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.8);
    fillLight.position.set(-5, -3, -3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0x06b6d4, 0x050713, 1.2);
    scene.add(hemiLight);

    // 4. Procedural 3D Holographic Artifact (Composite 3-12 Parts in a Group)
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Part 1: Core Holographic Icosahedron Sphere
    const coreGeo = new THREE.IcosahedronGeometry(1.3, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.85,
      ior: 1.5,
      thickness: 1.2,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    artifactGroup.add(coreMesh);

    // Part 2: Inner Pulsing Core
    const innerGeo = new THREE.OctahedronGeometry(0.7, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    artifactGroup.add(innerMesh);

    // Part 3: Equator Gyro Ring 1 (Torus)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.15
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    artifactGroup.add(ring1Mesh);

    // Part 4: Polar Gyro Ring 2 (Torus)
    const ring2Geo = new THREE.TorusGeometry(2.35, 0.035, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.2
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    artifactGroup.add(ring2Mesh);

    // Part 5: Outer Data Meridian Ring 3
    const ring3Geo = new THREE.TorusGeometry(2.6, 0.025, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.x = -Math.PI / 5;
    ring3Mesh.rotation.z = Math.PI / 6;
    artifactGroup.add(ring3Mesh);

    // Part 6: Orbital Satellites / Nodes (InstancedMesh)
    const nodeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.1
    });
    const nodeCount = 12;
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const tempMatrix = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();
    const tempScale = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.1;
      tempPos.set(Math.cos(angle) * radius, Math.sin(angle) * 0.4, Math.sin(angle) * radius);
      tempMatrix.compose(tempPos, tempQuat, tempScale);
      instancedNodes.setMatrixAt(i, tempMatrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    artifactGroup.add(instancedNodes);

    // Part 7: Floating Cyber Particle Dust Field
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Part 8: Soft Contact Grounding Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.8;
    scene.add(shadowPlane);

    // Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = mouseX * 0.4;
      targetRotX = -mouseY * 0.3;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const speed = configRef.current.speed;
      const theme = configRef.current.theme;
      const wireframe = configRef.current.wireframe;

      coreMat.wireframe = wireframe;

      // Theme color management
      if (theme === 'cyan') {
        coreMat.color.setHex(0x06b6d4);
        coreMat.emissive.setHex(0x0284c7);
      } else if (theme === 'purple') {
        coreMat.color.setHex(0xa855f7);
        coreMat.emissive.setHex(0x6b21a8);
      } else {
        coreMat.color.setHex(0x10b981);
        coreMat.emissive.setHex(0x047857);
      }

      // Smooth exponential damping
      artifactGroup.rotation.y += 0.4 * delta * speed;
      artifactGroup.rotation.x = THREE.MathUtils.damp(artifactGroup.rotation.x, targetRotX, 4, delta);
      artifactGroup.rotation.z = THREE.MathUtils.damp(artifactGroup.rotation.z, targetRotY * 0.5, 4, delta);

      // Multi-axis gyroscopic rotation
      ring1Mesh.rotation.z += 0.7 * delta * speed;
      ring2Mesh.rotation.x -= 0.5 * delta * speed;
      ring3Mesh.rotation.y += 0.3 * delta * speed;
      innerMesh.rotation.y -= 0.8 * delta * speed;
      innerMesh.rotation.z += 0.4 * delta * speed;

      // Subtle breath oscillation on core
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.03;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Particle subtle drifting
      particles.rotation.y = clock.getElapsedTime() * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-950/80 via-[#070b1e]/90 to-[#040612]/95 shadow-2xl">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Holographic IELTS Band Overlay (Top-Left Minimal Badge) */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/40">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Holographic Core
            </div>
            <div className="text-sm font-heading font-bold text-white flex items-center gap-1.5">
              Target Band {currentBand.toFixed(1)} <span className="text-slate-400 font-normal text-xs">/ 9.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Telemetry Stats (Top-Right Minimal Badge) */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none hidden sm:block">
        <div className="flex flex-col items-end gap-1.5 text-right font-mono text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 px-3.5 py-2 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">SIMULATION ENGINE:</span>
            <span className="text-emerald-400 font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">RUBRIC:</span>
            <span className="text-cyan-300">IELTS ACADEMIC 9.0</span>
          </div>
        </div>
      </div>

      {/* Center Interactive Floating Band Display (Unobtrusive) */}
      <div className="absolute bottom-16 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <div className="inline-block px-5 py-2 rounded-full bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
          <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase">
            Interactive 3D Band Hologram • Drag to Orbit
          </p>
        </div>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock (Adheres strictly to Three.js skill layout directive) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[94vw] flex flex-col items-center">
        {/* Toggle Expand/Collapse Button */}
        <button
          onClick={() => setIsControlsOpen(!isControlsOpen)}
          className="mb-1 text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          {isControlsOpen ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          <span>{isControlsOpen ? '▾ Hide 3D Dock' : '▴ 3D Scene Controls'}</span>
        </button>

        {/* Collapsible Dock Panel */}
        {isControlsOpen && (
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl">
            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <button
                onClick={() => setRotationSpeed(0.5)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  rotationSpeed === 0.5 ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                0.5x
              </button>
              <button
                onClick={() => setRotationSpeed(1)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  rotationSpeed === 1 ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                1.0x
              </button>
              <button
                onClick={() => setRotationSpeed(2)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  rotationSpeed === 2 ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                2.0x
              </button>
            </div>

            <div className="w-[1px] h-4 bg-slate-800" />

            {/* Wireframe Toggle */}
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                wireframeMode ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{wireframeMode ? 'Wireframe: ON' : 'Solid PBR'}</span>
            </button>

            <div className="w-[1px] h-4 bg-slate-800" />

            {/* Hologram Theme */}
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <button
                onClick={() => setHologramTheme('cyan')}
                className={`w-4 h-4 rounded-full bg-cyan-400 transition ring-offset-1 ring-offset-slate-950 ${
                  hologramTheme === 'cyan' ? 'ring-2 ring-cyan-400' : 'opacity-50 hover:opacity-100'
                }`}
                title="Neon Cyan"
              />
              <button
                onClick={() => setHologramTheme('purple')}
                className={`w-4 h-4 rounded-full bg-purple-500 transition ring-offset-1 ring-offset-slate-950 ${
                  hologramTheme === 'purple' ? 'ring-2 ring-purple-400' : 'opacity-50 hover:opacity-100'
                }`}
                title="Electric Purple"
              />
              <button
                onClick={() => setHologramTheme('emerald')}
                className={`w-4 h-4 rounded-full bg-emerald-400 transition ring-offset-1 ring-offset-slate-950 ${
                  hologramTheme === 'emerald' ? 'ring-2 ring-emerald-400' : 'opacity-50 hover:opacity-100'
                }`}
                title="Emerald Matrix"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
