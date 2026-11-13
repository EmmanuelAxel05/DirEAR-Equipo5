import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Principal from "./components/principal/principal";
import Objetivos from "./components/objetivos/objetivos";
import Unidad from "./components/unidad/unidad";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Principal />} />
        <Route path="/objetivos" element={<Objetivos />} />
        <Route path="/unidad-1" element={<Unidad numero={1} />} />
        <Route path="/unidad-2" element={<Unidad numero={2} />} />
      </Route>
    </Routes>
  );
}

export default App;