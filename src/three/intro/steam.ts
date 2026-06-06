import * as THREE from "three";

export function createSteam() {
  const steamGroup = new THREE.Group();

  for (let i = 0; i < 8; i++) {
    const material = new THREE.SpriteMaterial({
        color: 0x0000ff,
      transparent: false,
      opacity: 1,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

  sprite.position.set(
  (Math.random() - 0.5) * 0.3,
  i * 0.15,
  (Math.random() - 0.5) * 0.3
);

    sprite.scale.set(0.6, 0.6, 0.6);

    steamGroup.add(sprite);
  }

  console.log("sprites creados:", steamGroup.children.length);
  return steamGroup;
}