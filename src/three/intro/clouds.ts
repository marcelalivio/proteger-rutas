import * as THREE from "three";

export function setupSky(scene: THREE.Scene) {
  const loader = new THREE.TextureLoader();

  const skyTexture = loader.load("/textures/clouds/sky.jpg");

  scene.background = skyTexture;
}