import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
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
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
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

// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Clients from "./pages/Clients";
// import ClientLayout from "./pages/ClientLayout";
// import ClientProfile from "./pages/ClientProfile";
// import Applications from "./pages/Applications";
// import Credential from "./pages/Credential";
// import Reports from "./pages/Reports";
// import Overview from "./pages/Overview";

// function App() {
//   const role = localStorage.getItem("role");

//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />

//       {/* ROLE BASED DASHBOARD ACCESS */}
//       <Route
//         path="/dashboard/*"
//         element={
//           role ? <Dashboard /> : <Navigate to="/" />
//         }
//       />

//       {/* CLIENT ROUTES (PROTECT LATER IF NEEDED) */}
//       <Route path="/clients" element={<Clients />} />

//       <Route path="/clients/:client_id" element={<ClientLayout />}>
//         <Route index element={<ClientProfile />} />
//         <Route path="applications" element={<Applications />} />
//         <Route path="credentials" element={<Credential />} />
//         <Route path="reports" element={<Reports />} />
//         <Route path="overview" element={<Overview />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;