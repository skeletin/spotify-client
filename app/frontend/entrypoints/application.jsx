import { createRoot } from "react-dom/client";
import Home from "../components/Home";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Home />);
}
