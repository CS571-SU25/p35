import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);


document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------------- Rotation & X keyframes ---------------- */
  const BASE_ROT_Y = Math.PI; // 180° initial flip
  // progress (0→1) -> rotation Y
  const ROT_Y_KEYS = [
    { p: 0.00,  val: BASE_ROT_Y },                     // hold 1
    { p: 0.23,  val: BASE_ROT_Y },                     // start rotate 1
    { p: 0.30,  val: BASE_ROT_Y + Math.PI * 2 },       // end rotate 1
    { p: 0.445, val: BASE_ROT_Y + Math.PI * 2 },       // hold 2
    { p: 0.60,  val: BASE_ROT_Y + Math.PI * 0.2 },     // end rotate 2
    { p: 0.78,  val: BASE_ROT_Y + Math.PI * 0.2 },     // hold 3
  ];

  // progress -> X position (shift only during 2nd rotation)
  const X_START = -0.0005;
  const X_END   = -0.014;
  const X_KEYS = [
    { p: 0.00,  val: X_START },
    { p: 0.445, val: X_START }, // start move
    { p: 0.60,  val: X_END },   // end move
    { p: 1.00,  val: X_END },
  ];

  const HIDE_AT = 1.2;   // when to hide the model
  const SMOOTH  = 0.12;  // lerp smoothing for rotation/position

  function lerpKeys(progress, keys) {
    if (progress <= keys[0].p) return keys[0].val;
    if (progress >= keys[keys.length - 1].p) return keys[keys.length - 1].val;
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (progress >= a.p && progress <= b.p) {
        const t = (progress - a.p) / (b.p - a.p);
        return THREE.MathUtils.lerp(a.val, b.val, t);
      }
    }
    return keys[keys.length - 1].val;
  }

  /* ---------------- Lenis ---------------- */
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ---------------- SplitText ---------------- */
  const header1Split = new SplitText('.header-1 h1', {
    type: 'chars',
    charsClass: 'char',
  });
  const titleSplits = new SplitText('.tooltip .title h2', {
    type: 'lines',
    linesClass: 'line',
  });
  const descriptionSplits = new SplitText('.tooltip .description p', {
    type: 'lines',
    linesClass: 'line',
  });

  header1Split.chars.forEach(
    (char) => (char.innerHTML = `<span>${char.innerHTML}</span>`),
  );
  [...titleSplits.lines, ...descriptionSplits.lines].forEach(
    (line) => (line.innerHTML = `<span>${line.innerHTML}</span>`),
  );

  const animOptions = { duration: 1, ease: 'power3.out', stagger: 0.025 };
  const tooltipSelectors = [
    {
      trigger: 0.65,
      elements: [
        '.tooltip:nth-child(1) .icon ion-icon',
        '.tooltip:nth-child(1) .title .line > span',
        '.tooltip:nth-child(1) .description .line > span',
      ],
    },
    {
      trigger: 0.85,
      elements: [
        '.tooltip:nth-child(2) .icon ion-icon',
        '.tooltip:nth-child(2) .title .line > span',
        '.tooltip:nth-child(2) .description .line > span',
      ],
    },
  ];

  /* ---------------- First header in/out ---------------- */
  ScrollTrigger.create({
    trigger: '.product-overview',
    start: '75% bottom',
    onEnter: () =>
      gsap.to('.header-1 h1 .char > span', { y: '0%', ...animOptions }),
    onLeaveBack: () =>
      gsap.to('.header-1 h1 .char > span', { y: '100%', ...animOptions }),
  });

  /* ---------------- Three.js setup ---------------- */
  let model, currentRotation = BASE_ROT_Y, modelSize;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1.0;

  document.querySelector('.model-container').appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(1, 2, 3);
  mainLight.castShadow = true;
  mainLight.shadow.bias = -0.001;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-2, 0, -2);
  scene.add(fillLight);

  function setupModel() {
    if (!model || !modelSize) return;

    const isMobile = window.innerWidth < 1000;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.set(
      isMobile ? center.x + modelSize.x * 1 : -center.x - modelSize.x * 0.4,
      -center.y + modelSize.y * 0.085,
      -center.z,
    );

    const cameraDistance = isMobile ? 2 : 1.25;

    camera.position.set(
      0,
      0,
      Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance,
    );

    camera.lookAt(0, 0, 0);
  }

  /* ---------------- Load model ---------------- */
  new GLTFLoader().load('/landing/assets/pc_animation.glb', (gltf) => {
    model = gltf.scene;

    model.traverse((node) => {
      if (!node.isMesh) return;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach((m) => {
        if (m?.map) {
          m.map.colorSpace = THREE.SRGBColorSpace;
          m.map.needsUpdate = true;
        }
      });
    });

    scene.add(model);

    // initial scale/pos/rot
    model.scale.set(0.13, 0.13, 0.13);
    model.position.set(X_START, 0, 0);
    model.rotation.set(0, BASE_ROT_Y, 0);

    // sizing
    const box = new THREE.Box3().setFromObject(model);
    modelSize = box.getSize(new THREE.Vector3());
    setupModel();

    // after setupModel (which may alter x), re-apply start x
    model.position.x = X_START;

    window.model = model; // debug
  });

  /* ---------------- Render loop ---------------- */
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setupModel();
  });

  /* ---------------- Master ScrollTrigger ---------------- */
  ScrollTrigger.create({
    trigger: '.product-overview',
    start: 'top top',
    end: `+=${window.innerHeight * 10}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: ({ progress }) => {
      /* header 1 x slide */
      const headerProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
      gsap.to('.header-1', {
        xPercent:
          progress < 0.05 ? 0 : progress > 0.35 ? -100 : -100 * headerProgress,
      });

      /* circular mask */
      const maskSize =
        progress < 0.2 ? 0 :
          progress > 0.3 ? 100 :
            100 * ((progress - 0.2) / 0.1);

      gsap.to('.circular-mask', {
        clipPath: `circle(${maskSize}% at 50% 50%)`,
      });

      /* header 2 x slide */
      const header2Progress = (progress - 0.15) / 0.35;
      const header2XPercent =
        progress < 0.15 ? 100 :
          progress > 0.5 ? -200 :
            100 - 300 * header2Progress;

      gsap.to('.header-2', { xPercent: header2XPercent });

      /* divider scale */
      const scaleX =
        progress < 0.45 ? 0 :
          progress > 0.65 ? 100 :
            100 * ((progress - 0.45) / 0.2);
      gsap.to('.tooltip .divider', { scaleX: `${scaleX}%`, ...animOptions });

      /* tooltips in/out */
      tooltipSelectors.forEach(({ trigger, elements }) => {
        gsap.to(elements, {
          y: progress >= trigger ? '0%' : '125%',
          ...animOptions,
        });
      });

      /* ---- rotation + X via keyframes ---- */
      if (model) {
        model.visible = progress < HIDE_AT;

        const targetY = lerpKeys(progress, ROT_Y_KEYS);
        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, targetY, SMOOTH);
        currentRotation = model.rotation.y;

        const targetX = lerpKeys(progress, X_KEYS);
        model.position.x = THREE.MathUtils.lerp(model.position.x, targetX, SMOOTH);
      }
    },
  });
});
