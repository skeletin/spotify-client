import AppOverlay from "@/components/overlays/AppOverlay";
import { OrbitControls, Stage } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      fetch(`http://localhost:3000/auth/callback?code=${code}&state=${state}`)
        .then((res) => res.json())
        .then((data: SpotifyApiResponse) => {
          console.log(data);
          localStorage.setItem("token", data.accessToken);
        });
    }
  }, [code, state]);

  // const showInfo = () => {
  //   fetch("https://api.spotify.com/v1/me", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")} `,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  // };

  return (
    <div className="border border-black">
      <Canvas>
        <color attach="background" args={["skyblue"]} />
        <Stage
          intensity={0.5}
          preset="rembrandt"
          shadows={{
            type: "accumulative",
            color: "skyblue",
            colorBlend: 2,
            opacity: 1,
          }}
          adjustCamera={1}
          environment="city"
        ></Stage>
        <OrbitControls
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.9}
          makeDefault
        />
      </Canvas>
    </div>
  );
};

export default Callback;
