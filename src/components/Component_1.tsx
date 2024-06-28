import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // Updated import path

const Spotlight = ({
  color,
  position,
}: {
  color: number;
  position: [number, number, number];
}) => {
  const light = useRef<THREE.SpotLight>(null!);
  

  useEffect(() => {
    const tween = (light: THREE.SpotLight) => {
      new TWEEN.Tween(light)
        .to(
          {
            angle: Math.random() * 0.7 + 0.1,
            penumbra: Math.random() + 1,
          },
          Math.random() * 3000 + 2000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      new TWEEN.Tween(light.position)
        .to(
          {
            x: Math.random() * 3 - 1.5,
            y: Math.random() * 1 + 1.5,
            z: Math.random() * 3 - 1.5,
          },
          Math.random() * 3000 + 2000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    };

    const updateTweens = () => {
      if (light.current) {
        tween(light.current);
      }
      setTimeout(updateTweens, 5000);
    };

    updateTweens();
  }, []);

  return (
    <spotLight
      ref={light}
      color={color}
      intensity={10}
      distance={50}
      angle={0.3}
      penumbra={0.2}
      decay={2}
      castShadow
      position={position}
    />
  );
};

const Model = () => {
  const gltf = useLoader(GLTFLoader, "MDel_2.glb");
  return <primitive object={gltf.scene} scale={0.2} position={[0, 0.0, 0]} />;
};

const Sprite = ({ position }: { position: [number, number, number] }) => {
  const texture = useLoader(THREE.TextureLoader, "MDEL_small_installation.png");

  // Calculate aspect ratio
  const aspect = texture.image.width / texture.image.height;

  return (
    <sprite position={position} scale={[1 * aspect, 1 * aspect, 1]}>
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

const Scene = () => {
  const { scene, camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.0, 3.1);
    camera.lookAt(0, 0.0, 0);
    scene.background = new THREE.Color(0x87ceeb);
  }, [camera, scene]);

  useFrame(() => {
    TWEEN.update();
  });

  const groundTexture = useLoader(
    THREE.TextureLoader,
    "Pavement_background_image.png"
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <Spotlight color={0xffffff} position={[1.5, 4, 4.5]} />
      <Spotlight color={0xffffff} position={[0, 4, 3.5]} />
      <Spotlight color={0xffffff} position={[-1.5, 4, 4.5]} />

      <Plane
        args={[3, 3]}
        rotation-x={-Math.PI / 2}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <meshPhongMaterial attach="material" map={groundTexture} />
      </Plane>
      <Plane
        args={[100, 100]} // Adjusted size for larger ground plane
        rotation-x={-Math.PI / 2}
        position={[0, -0.15, 0]} // Lower position to avoid z-fighting
        receiveShadow
      >
        <meshPhongMaterial attach="material" color="#404040" />{""}
        
      </Plane>

      <Sprite position={[0, 0.4, -1.5]} />
      <Model />
    </>
  );
};

const App = () => {
  return (
    <Canvas shadows camera={{ position: [4.6, 2.2, -2.1], fov: 35 }}>
      <color attach="background" args={["#202020"]} />
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={10}
      />
      <Scene />
    </Canvas>
  );
};

export default App;
