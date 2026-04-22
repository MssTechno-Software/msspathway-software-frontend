import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../container/Sidebar";
import Clients from "./Clients";
import Timesheet from "./Timesheet";
import AddClient from "./AddClient";
import LeaveRequests from "./LeaveRequest";
import Employee from "./Employee";
import AddEmployee from "./AddEmployee";
import EmployeeProfile from "./EmployeeProfile";

function Dashboard() {
    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <Routes>
                    <Route path="/" element={<Navigate to="clients" />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="timesheet" element={<Timesheet />} />
                    <Route path="employee" element={<Employee />} />
                    <Route path="add-employee" element={<AddEmployee />} />
                    <Route path="employee-profile/:employee_id" element={<EmployeeProfile />} />
                    <Route path="leave-requests" element={<LeaveRequests />} />
                    <Route path="add-client" element={<AddClient />} />
                </Routes>
            </div>

        </div>
    );
}
export default Dashboard;

// import { Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "../container/Sidebar";

// import Clients from "./Clients";
// import Timesheet from "./Timesheet";
// import LeaveRequests from "./LeaveRequest";
// import Leave from "../container/Leave";

// function Dashboard() {
//   const role = localStorage.getItem("role");

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         <Routes>

//           {/* DEFAULT PAGE BASED ON ROLE */}
//           <Route
//             path="/"
//             element={
//               role === "admin" || role === "pathway_admin"
//                 ? <Navigate to="clients" />
//                 : role === "pathway_user"
//                 ? <Navigate to="clients" />
//                 : <Navigate to="timesheet" />
//             }
//           />

//           {/* CLIENTS */}
//           {(role === "admin" || role === "pathway_admin") && (
//             <Route path="clients" element={<Clients />} />
//           )}

//           {/* ASSIGNED CLIENTS */}
//           {role === "pathway_user" && (
//             <Route path="assigned-clients" element={<Clients />} />
//           )}

//           {/* TIMESHEET */}
//           {[
//             "admin",
//             "software_admin",
//             "software_user",
//             "pathway_user",
//           ].includes(role) && (
//             <Route path="timesheet" element={<Timesheet />} />
//           )}

//           {/* LEAVE REQUEST */}
//           {[
//             "admin",
//             "software_admin",
//             "pathway_admin",
//           ].includes(role) && (
//             <Route path="leave-requests" element={<LeaveRequests />} />
//           )}

//           {/* APPLY LEAVE */}
//           {["software_admin", "software_user"].includes(role) && (
//             <Route path="apply-leave" element={<Leave />} />
//           )}

//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;