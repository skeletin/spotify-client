import { Routes } from "react-router";
import { BrowserRouter as Router, Route } from "react-router";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./components/features/Home/Home";
import Callback from "./components/features/Callback/Callback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/callback" element={<Callback />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
