/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { IoFlashOutline } from "react-icons/io5";

import Navbar from "@/components/common/Navbar"; // ★ NEW
import "./landing.css";

gsap.registerPlugin(ScrollTrigger);

// SplitText load (unchanged)
let SplitText: any;
try {
  // @ts-ignore
  SplitText = (await import("gsap/SplitText")).default ?? (await import("gsap/SplitText")).SplitText;
} catch {
  // @ts-ignore
  SplitText = (window as any).SplitText;
}

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!rootRef.current) return;

    /************ CONSTANTS & HELPERS ************/
    const BASE_ROT_Y = Math.PI;

    const ROT_Y_KEYS = [
      { p: 0.0,   val: BASE_ROT_Y },
      { p: 0.23,  val: BASE_ROT_Y },
      { p: 0.30,  val: BASE_ROT_Y + Math.PI * 2 },
      { p: 0.445, val: BASE_ROT_Y + Math.PI * 2 },
      { p: 0.60,  val: BASE_ROT_Y + Math.PI * 0.2 },
      { p: 0.78,  val: BASE_ROT_Y + Math.PI * 0.2 },
    ];

    const X_START = -0.0005;
    const X_END   = -0.014;
    const X_KEYS = [
      { p: 0.0,   val: X_START },
      { p: 0.445, val: X_START },
      { p: 0.60,  val: X_END },
      { p: 1.0,   val: X_END },
    ];

    const HIDE_AT = 1.2;
    const SMOOTH = 0.12;

    function lerpKeys(progress: number, keys: { p: number; val: number }[]) {
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
    function killBottomSpace(self: ScrollTrigger) {
      const spacer = (self.pin as HTMLElement)?.parentElement as HTMLElement;
      if (!spacer || !spacer.classList.contains("gsap-pin-spacer")) return;

      // lock spacer height to the pinned element, then remove padding/margin
      const pinEl = self.pin as HTMLElement;
      spacer.style.height = `${pinEl.offsetHeight}px`;
      spacer.style.paddingBottom = "0px";
      spacer.style.marginBottom = "0px";
    }


    /************ LENIS ************/
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const lenisTicker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);

    /************ SPLITTEXT ************/
    if (SplitText) {
      const header1Split = new SplitText(".header-1 h1", {
        type: "chars",
        charsClass: "char",
      });

      const titleSplits = new SplitText(".tooltip .title h2", {
        type: "lines",
        linesClass: "line",
      });

      const descriptionSplits = new SplitText(".tooltip .description p", {
        type: "lines",
        linesClass: "line",
      });

      header1Split.chars.forEach(
        (char: HTMLElement) => (char.innerHTML = `<span>${char.innerHTML}</span>`)
      );
      [...titleSplits.lines, ...descriptionSplits.lines].forEach(
        (line: HTMLElement) => (line.innerHTML = `<span>${line.innerHTML}</span>`)
      );
    } else {
      console.warn("SplitText not found. Text animations will be skipped.");
    }

    const animOptions = { duration: 1, ease: "power3.out", stagger: 0.025 };
    const tooltipSelectors = [
      {
        trigger: 0.65,
        elements: [
          ".tooltip:nth-child(1) .icon svg, .tooltip:nth-child(1) .icon ion-icon",
          ".tooltip:nth-child(1) .title .line > span",
          ".tooltip:nth-child(1) .description .line > span",
        ],
      },
      {
        trigger: 0.85,
        elements: [
          ".tooltip:nth-child(2) .icon svg, .tooltip:nth-child(2) .icon ion-icon",
          ".tooltip:nth-child(2) .title .line > span",
          ".tooltip:nth-child(2) .description .line > span",
        ],
      },
    ];

    /************ THREE.JS SETUP ************/
    let model: THREE.Object3D | null = null;
    let modelSize: THREE.Vector3 | undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;

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
        -center.z
      );

      const cameraDistance = isMobile ? 2 : 1.25;
      camera.position.set(
        0,
        0,
        Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
      );
      camera.lookAt(0, 0, 0);
    }

    const loader = new GLTFLoader();
    loader.load(`${import.meta.env.BASE_URL || "/"}models/pc_animation.glb`, (gltf) => {
      model = gltf.scene;

      model.traverse((node: any) => {
        if (!node.isMesh) return;
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach((m: any) => {
          if (m?.map) {
            m.map.colorSpace = THREE.SRGBColorSpace;
            m.map.needsUpdate = true;
          }
        });
      });

      scene.add(model);

      model.scale.set(0.13, 0.13, 0.13);
      model.position.set(X_START, 0, 0);
      model.rotation.set(0, BASE_ROT_Y, 0);

      const box = new THREE.Box3().setFromObject(model);
      modelSize = box.getSize(new THREE.Vector3());
      setupModel();

      model.position.x = X_START;
    });

    // Render loop
    let frameId: number;
    const animate = () => {
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };
    window.addEventListener("resize", onResize);

    /************ Navbar initial state ************/ // ★ NEW
    gsap.set("#site-nav", { opacity: 0, y: -40, pointerEvents: "none" });
    const NAV_SHOW_AT = 0.30; // ★ NEW

    /************ GSAP ANIMATIONS ************/
    const headerTrigger = ScrollTrigger.create({
      trigger: ".product-overview",
      start: "75% bottom",
      onEnter: () =>
        gsap.to(".header-1 h1 .char > span", { y: "0%", ...animOptions }),
      onLeaveBack: () =>
        gsap.to(".header-1 h1 .char > span", { y: "100%", ...animOptions }),
    });

    const masterTrigger = ScrollTrigger.create({
      trigger: ".product-overview",
      start: "top top",
      end: `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        // header 1 x slide
        const headerProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
        gsap.to(".header-1", {
          xPercent:
            progress < 0.05
              ? 0
              : progress > 0.35
                ? -100
                : -100 * headerProgress,
        });

        // circular mask
        const maskSize =
          progress < 0.2
            ? 0
            : progress > 0.3
              ? 100
              : 100 * ((progress - 0.2) / 0.1);
        gsap.to(".circular-mask", {
          clipPath: `circle(${maskSize}% at 50% 50%)`,
        });

        // header 2 x slide
        const header2Progress = (progress - 0.15) / 0.35;
        const header2XPercent =
          progress < 0.15
            ? 100
            : progress > 0.5
              ? -200
              : 100 - 300 * header2Progress;
        gsap.to(".header-2", { xPercent: header2XPercent });

        // divider scale
        const scaleX =
          progress < 0.45
            ? 0
            : progress > 0.65
              ? 100
              : 100 * ((progress - 0.45) / 0.2);
        gsap.to(".tooltip .divider", { scaleX: `${scaleX}%`, ...animOptions });

        // tooltips in/out
        tooltipSelectors.forEach(({ trigger, elements }) => {
          gsap.to(elements, {
            y: progress >= trigger ? "0%" : "125%",
            ...animOptions,
          });
        });

        // model keyframes
        if (model) {
          model.visible = progress < HIDE_AT;

          const targetY = lerpKeys(progress, ROT_Y_KEYS);
          model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, targetY, SMOOTH);

          const targetX = lerpKeys(progress, X_KEYS);
          model.position.x = THREE.MathUtils.lerp(model.position.x, targetX, SMOOTH);
        }

        // ---- Navbar toggle (doesn't touch spacer / scroll) ----  ★ NEW
        const showNav = progress > NAV_SHOW_AT;
        gsap.to("#site-nav", {
          opacity: showNav ? 1 : 0,
          y: showNav ? 0 : -40,
          pointerEvents: showNav ? "auto" : "none",
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
        });
      },
      onRefresh: killBottomSpace,
      onRefreshInit: killBottomSpace,
    });

    /************ CLEANUP ************/
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      model?.traverse((child: THREE.Object3D) => {
        if ((child as any).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.filter(Boolean).forEach((m: THREE.Material) => m.dispose());
        }
      });

      masterTrigger.kill();
      headerTrigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(lenisTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="landing-root">
      {/* ★ NEW Navbar wrapper */}
      <div id="site-nav" style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 9999 }}>
        <Navbar />
      </div>

      <section className="intro flex items-center justify-center bg-off-black text-white h-screen">
        <h1 className="text-hero text-center">Build the PC You Actually Need.</h1>
      </section>

      <section className="product-overview">
        <div className="header-1"><h1>Every Great Rig Starts Here</h1></div>
        <div className="header-2"><h2>The ClearWire Builder</h2></div>

        <div className="circular-mask" />

        <div className="tooltips">
          <Tooltip
            icon={<IoFlashOutline />}
            title="Zero Guesswork Pricing"
            desc="Every component, cost, and lead time is itemized. No hidden markups—ever."
          />
          <Tooltip
            icon={<IoFlashOutline />}
            title="Support That Knows Hardware"
            desc="Real builders, real answers. Need an upgrade plan? We’ve got you covered."
          />
        </div>

        <div className="model-container">
          <canvas id="scene" ref={canvasRef} />
        </div>
      </section>

      <section className="outro flex flex-col items-center justify-center gap-5 bg-off-black text-white py-12">
        <h1 className="text-hero-sm md:text-hero text-center">Ready to build yours?</h1>
        <p className="outro-sub">Spec it, price it, and build it — no guesswork.</p>
        <button className="btn-primary" onClick={() => navigate("/builder")}>
          Launch Builder
        </button>
      </section>
    </div>
  );
}

function Tooltip({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="tooltip">
      <div className="icon">{icon}</div>
      <div className="divider" />
      <div className="title"><h2>{title}</h2></div>
      <div className="description"><p>{desc}</p></div>
    </div>
  );
}
