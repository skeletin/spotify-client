import LiquidEther from "./LiquidEther";

const Background = () => {
  return (
    <div className="absolute h-full w-full">
      <LiquidEther
        colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
        color0="#29ff54"
        color1="#FF9FFC"
        color2="#B19EEF"
      />
    </div>
  );
};

export default Background;
