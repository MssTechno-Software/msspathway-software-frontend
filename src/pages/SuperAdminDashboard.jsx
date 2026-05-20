import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../container/Sidebar";
import Clients from "./Clients";
import Timesheet from "./Timesheet";
import Employees from "./Employee";
import LeaveRequests from "./LeaveRequest";

function SuperAdminDashboard() {
    const employee_id = localStorage.getItem("employee_id");
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-3">
                <Routes>
                    <Route path="/" element={<Navigate to="clients" />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="timesheet" element={<Timesheet />} />
                    <Route path="leave-requests" element={<LeaveRequests />} />
                    <Route path="employee" element={<Employee />} />
                </Routes>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;