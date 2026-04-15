import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Applications from "./pages/Applications";
import Credential from "./pages/Credential";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/applications/:client_id" element={<Applications />}>
        <Route path="credentials" element={<Credential />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;