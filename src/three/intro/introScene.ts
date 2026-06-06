import * as THREE from "three";
import { loadCoffee } from "./coffee";
import { setupSky } from "./clouds";
import { createSteam } from "./steam";

import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect
} from "postprocessing";

export function createIntroScene() {
  const intro = document.createElement("div");

  intro.style.position = "fixed";
  intro.style.inset = "0";
  intro.style.background = "black";
  intro.style.zIndex = "999999";
  intro.style.overflow = "hidden";

  // TEXT OVERLAY

  const titleWrap = document.createElement("div");

  titleWrap.style.position = "absolute";
  titleWrap.style.top = "58%";
  titleWrap.style.left = "50%";
  titleWrap.style.transform = "translateX(-50%)";
  titleWrap.style.zIndex = "20";
  titleWrap.style.textAlign = "center";
  titleWrap.style.pointerEvents = "none";

  const subtitle = document.createElement("div");
  subtitle.textContent = "Bienvenidos a";

  subtitle.style.fontFamily = "'Playfair Display', serif";
  subtitle.style.fontSize = "46px";
  subtitle.style.fontWeight = "500";
  subtitle.style.color = "#7a5230";
  subtitle.style.letterSpacing = "1px";
  subtitle.style.textShadow = `
    0 2px 8px rgba(255,220,150,0.35),
    0 0 30px rgba(0,0,0,0.25)
  `;

  const title = document.createElement("div");
  title.textContent = "Café de día";

  title.style.fontFamily = "'Playfair Display', serif";
  title.style.lineHeight = "1";
  title.style.letterSpacing = "1px";
  title.style.fontSize = "150px";
  title.style.fontWeight = "800";
  title.style.color = "#8c5a2c";
  title.style.textShadow = `
    0 4px 14px rgba(255,220,150,0.45),
    0 0 40px rgba(0,0,0,0.2)
  `;

  titleWrap.appendChild(subtitle);
  titleWrap.appendChild(title);

  intro.appendChild(titleWrap);
  document.body.appendChild(intro);

  // THREE SCENE

  const scene = new THREE.Scene();
  setupSky(scene);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

camera.position.set(0, 1.2, 8.2);
camera.lookAt(0, 1.4, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  intro.appendChild(renderer.domElement);

  // LIGHTING

  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff2d6, 3);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 2);
  rimLight.position.set(-6, 4, -5);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffd8a8, 2);
  fillLight.position.set(0, 3, 4);
  scene.add(fillLight);

  // OBJECTS

  let coffee: THREE.Object3D | null = null;
  let steam: THREE.Group | null = null;

 loadCoffee(scene).then((loadedCoffee) => {
  coffee = loadedCoffee;

  steam = createSteam();
  console.log("steam created", steam);

  steam.position.set(0, 5, 0);

  coffee.add(steam);
  console.log(coffee.children);
});

  // ANIMATION

  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (coffee) {
      coffee.rotation.y += 0.01;
      coffee.position.y =
         1.6 + Math.sin(Date.now() * 0.001) * 0.08;
    }

    if (steam) {
      steam.children.forEach((particle, i) => {
        particle.position.y += 0.03;

        particle.position.x +=
          Math.sin(Date.now() * 0.001 + i) * 0.0008;

        const sprite = particle as THREE.Sprite;

        if (sprite.material instanceof THREE.SpriteMaterial) {
          sprite.material.opacity =
            0.15 + Math.sin(Date.now() * 0.002 + i) * 0.08;
        }

        if (particle.position.y > 3.5) {
          particle.position.y = 0;
        }
      });
    }

    composer.render();
  }

  animate();

  const composer =
  new EffectComposer(renderer);

composer.addPass(
  new RenderPass(scene, camera)
);

composer.addPass(
  new EffectPass(
    camera,
    new BloomEffect({
      intensity: 1.5,
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0.9
    })
  )
);

  // EXIT

  setTimeout(() => {
    intro.style.transition = "opacity 1.5s ease";
    intro.style.opacity = "0";

    setTimeout(() => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      intro.remove();
    }, 1500);
  }, 6000);


  // RESPONSIVE

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });


}