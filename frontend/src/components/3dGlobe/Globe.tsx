import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Store ref value for cleanup
    const currentContainer = containerRef.current;

    let group: THREE.Group;
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let positions: Float32Array, colors: Float32Array;
    let particles: THREE.BufferGeometry;
    let pointCloud: THREE.Points;
    let particlePositions: Float32Array;
    let linesMesh: THREE.LineSegments;
    let controls: OrbitControls;
    const particlesData: Array<{ velocity: THREE.Vector3; numConnections: number }> = [];
    
    const lc = new THREE.Color("#4F46E5");
    const maxParticleCount = 500;
    const particleCount = 400;
    const r = 800;
    const rHalf = r / 2;
    const v3 = new THREE.Vector3();

    const effectController = {
      minDistance: 100,
      limitConnections: true,
      maxConnections: 15,
      particleCount: 250
    };

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
      camera.position.z = 1200;

      scene = new THREE.Scene();
      group = new THREE.Group();
      scene.add(group);

      const segments = maxParticleCount * maxParticleCount;

      positions = new Float32Array(segments * 3);
      colors = new Float32Array(segments * 3);

      const pMaterial = new THREE.PointsMaterial({
        color: 0x6366F1,
        size: 4,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
      });

      particles = new THREE.BufferGeometry();
      particlePositions = new Float32Array(maxParticleCount * 3);

      for (let i = 0; i < maxParticleCount; i++) {
        const radius = Math.random() * rHalf + rHalf/2;
        v3.randomDirection().setLength(radius);

        particlePositions[i * 3] = v3.x;
        particlePositions[i * 3 + 1] = v3.y;
        particlePositions[i * 3 + 2] = v3.z;

        particlesData.push({
          velocity: new THREE.Vector3().randomDirection().multiplyScalar(0.5),
          numConnections: 0
        });
      }

      particles.setDrawRange(0, particleCount);
      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

      pointCloud = new THREE.Points(particles, pMaterial);
      group.add(pointCloud);

      const geometry = new THREE.BufferGeometry();

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

      geometry.computeBoundingSphere();
      geometry.setDrawRange(0, 0);

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
      });

      linesMesh = new THREE.LineSegments(geometry, material);
      group.add(linesMesh);

      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      
      // Add renderer to container
      currentContainer.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      
      controls.minDistance = 1200;
      controls.maxDistance = 1200;

      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      
      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;

      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
      }

      for (let i = 0; i < particleCount; i++) {
        const particleData = particlesData[i];

        particlePositions[i * 3] += particleData.velocity.x;
        particlePositions[i * 3 + 1] += particleData.velocity.y;
        particlePositions[i * 3 + 2] += particleData.velocity.z;

        v3.fromArray(particlePositions, i * 3);
        const v3len = v3.length();
        v3.normalize().negate();
        if (v3len > rHalf) particleData.velocity.reflect(v3);

        if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections)
          continue;

        for (let j = i + 1; j < particleCount; j++) {
          const particleDataB = particlesData[j];
          if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
            continue;

          const dx = particlePositions[i * 3] - particlePositions[j * 3];
          const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
          const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < effectController.minDistance) {
            particleData.numConnections++;
            particleDataB.numConnections++;

            const alpha = 1.0 - dist / effectController.minDistance;

            positions[vertexpos++] = particlePositions[i * 3];
            positions[vertexpos++] = particlePositions[i * 3 + 1];
            positions[vertexpos++] = particlePositions[i * 3 + 2];

            positions[vertexpos++] = particlePositions[j * 3];
            positions[vertexpos++] = particlePositions[j * 3 + 1];
            positions[vertexpos++] = particlePositions[j * 3 + 2];

            colors[colorpos++] = alpha * lc.r;
            colors[colorpos++] = alpha * lc.g;
            colors[colorpos++] = alpha * lc.b;

            colors[colorpos++] = alpha * lc.r;
            colors[colorpos++] = alpha * lc.g;
            colors[colorpos++] = alpha * lc.b;

            numConnected++;
          }
        }
      }

      linesMesh.geometry.setDrawRange(0, numConnected * 2);
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;

      pointCloud.geometry.attributes.position.needsUpdate = true;

      controls.update();

      const time = Date.now() * 0.001;
      group.rotation.y = time * 0.1;
      
      renderer.render(scene, camera);
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
      // Use stored ref value in cleanup
      if (currentContainer && renderer.domElement.parentElement === currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
}