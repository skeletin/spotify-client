import logo from "../../assets/images/skeletin-logo.svg";

const Footer = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#191414] px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Powered by
        </span>
        <img src={logo} alt="" className="h-6 w-auto" />
      </div>
      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold uppercase tracking-wider text-[#1db954] hover:underline"
      >
        Listen on Spotify
      </a>
    </div>
  );
};

export default Footer;
