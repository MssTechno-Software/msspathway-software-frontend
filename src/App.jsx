import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Clients from "./pages/Clients";
import ClientLayout from "./pages/ClientLayout";
import ClientProfile from "./pages/ClientProfile";
import Applications from "./pages/Applications";
import Credential from "./pages/Credential";
import Reports from "./pages/Reports";
import Overview from "./pages/Overview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to='/Login' replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/employee-dashboard/*" element={<EmployeeDashboard />} />
      <Route path="/clients" element={<Clients />} />

      {/* NEW STRUCTURE */}
      <Route path="/clients/:client_id" element={<ClientLayout />}>

      {/*  DEFAULT PAGE (THIS OPENS FIRST) */}
      <Route index element={<ClientProfile />} />

      {/* SUB PAGES */}
      <Route path="applications" element={<Applications />} />
      <Route path="credentials" element={<Credential />} />
      <Route path="reports" element={<Reports />} />
      <Route path="overview" element={<Overview />} />

    </Route>
  </Routes>
  );
}

export default App;