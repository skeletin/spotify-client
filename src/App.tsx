import { Routes } from "react-router";
import { BrowserRouter as Router, Route } from "react-router";
import AppLayout from "./components/layouts/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
