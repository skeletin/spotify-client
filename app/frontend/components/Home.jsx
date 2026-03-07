import { Canvas, useFrame } from "@react-three/fiber";
import { SpotifyLogo } from "./SpotifyLogo";
import { Center, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { CanvasTexture, Color, RepeatWrapping } from "three";
import { state } from "../store/store";
import skeletinLogo from "../../assets/images/skeletin-logo.svg";
import spotifyTextLogo from "../../assets/images/spotify-text-logo.svg";

const Home = ({ position = [0, 0.1, 3.8], fov = 33 }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0d2f1d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(40,173,89,0.32)_0%,rgba(12,45,28,0.96)_68%)]" />
      <HeroOverlay />
      <Canvas
        shadows
        camera={{ position, fov }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        eventSource={document.getElementById("root")}
        eventPrefix="client"
      >
        <color attach="background" args={["#0f3a24"]} />
        <fog attach="fog" args={["#0f3a24", 2.8, 6.6]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          intensity={2.2}
          position={[1.8, 0.6, 2.2]}
        />
        <spotLight
          castShadow
          intensity={30}
          angle={0.3}
          penumbra={0.6}
          distance={9}
          decay={1.5}
          position={[0.34, 0.65, 2.9]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0002}
        />
        <spotLight
          intensity={7}
          color="#7ef5a6"
          angle={0.6}
          penumbra={1}
          position={[0, 2.5, 1.8]}
        />
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
        <Wall />
        <CameraRig>
          <group position={[0.34, -0.05, 0.02]} scale={0.58}>
            <Center>
              <SpotifyLogo />
            </Center>
          </group>
        </CameraRig>
      </Canvas>
    </div>
  );
};

function HeroOverlay() {
  const loginIntoSpotify = () => {
    window.location.assign("/login");
  };
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
      <div className="pointer-events-auto ml-[6vw] flex w-[46vw] max-w-[680px] min-w-[320px] flex-col gap-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-[170px] items-center">
            <img
              src={skeletinLogo}
              alt="Skeletin logo"
              className="max-h-full w-auto object-contain opacity-95"
            />
          </div>
          <span className="text-base  uppercase tracking-[0.2em] text-emerald-100/90">
            x
          </span>
          <div className="flex h-10 w-[170px] items-center">
            <img
              src={spotifyTextLogo}
              alt="Spotify text logo"
              className="max-h-full w-auto object-contain opacity-95 scale-150 translate-x-3 -translate-y-1"
            />
          </div>
        </div>

        <h1 className="max-w-[640px] text-6xl font-black uppercase italic leading-[0.88] tracking-[-0.04em] drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:text-7xl md:text-8xl">
          Built
          <br />
          For
          <br />
          Better Listening.
        </h1>

        <div>
          <form method="get" action="/login">
            <button
              type="submit"
              className="rounded-md border border-emerald-100/30 bg-black/35 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-emerald-200/50 hover:bg-black/50 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Wall() {
  const wallRef = useRef();
  const offsetWallColor = useRef(new Color("#168a43"));
  const snap = useSnapshot(state);
  const paintTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = 110 + Math.floor(Math.random() * 50);
      imageData.data[i] = noise;
      imageData.data[i + 1] = noise;
      imageData.data[i + 2] = noise;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(14, 14);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((sceneState, delta) => {
    const { camera, viewport } = sceneState;
    const distanceFromCamera = 4.5;
    const wallZ = camera.position.z - distanceFromCamera;

    wallRef.current.position.set(camera.position.x, camera.position.y, wallZ);
    const wallViewport = viewport.getCurrentViewport(camera, [
      camera.position.x,
      camera.position.y,
      wallZ,
    ]);
    wallRef.current.scale.set(wallViewport.width * 1.25, wallViewport.height * 1.25, 1);

    offsetWallColor.current
      .set(snap.color)
      .offsetHSL(0.01, -0.18, -0.12);
    easing.dampC(
      wallRef.current.material.color,
      offsetWallColor.current,
      0.35,
      delta
    );
  });
  return (
    <mesh ref={wallRef} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#168a43"
        roughness={0.94}
        metalness={0.03}
        map={paintTexture}
        bumpMap={paintTexture}
        bumpScale={0.03}
      />
    </mesh>
  );
}

function CameraRig({ children }) {
  const group = useRef();
  const snap = useSnapshot(state);
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [snap.intro ? -state.viewport.width / 5 : 0, 0, 3.8],
      0.25,
      delta
    );
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 16, -state.pointer.x / 8, 0],
      0.25,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
}

export default Home;
