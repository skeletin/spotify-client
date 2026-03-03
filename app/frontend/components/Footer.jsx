import logo from "../../assets/images/skeletin-logo.svg";

const Footer = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="text-white text-xs font-thin tracking-widest">
          POWERED BY
        </div>
        <img className="w-22" src={logo} />
      </div>
    </div>
  );
};

export default Footer;
