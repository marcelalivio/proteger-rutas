import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function loadCoffee(scene: THREE.Scene) {
  const loader = new GLTFLoader();

  return new Promise<THREE.Object3D>((resolve, reject) => {
    loader.load(
      "/models/coffee.glb",

      (gltf) => {
        const coffee = gltf.scene;

        coffee.scale.set(30,30,30);

        coffee.position.set(0, 3.5, 0);

        scene.add(coffee);
        coffee.rotation.y = Math.PI;

        resolve(coffee);
      },

      undefined,

      (error) => {
        console.error("Error loading coffee:", error);
        reject(error);
      }
    );
  });
}