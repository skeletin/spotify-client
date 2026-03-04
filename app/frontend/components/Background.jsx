import DarkVeil from "./DarkVeil";

const Background = () => {
  return (
    <div className="absolute h-full w-full">
      <DarkVeil
        hueShift={52}
        scanlineIntensity={0.76}
        speed={0.0}
        scanlineFrequency={5}
        warpAmount={0.3}
      />
    </div>
  );
};

export default Background;
