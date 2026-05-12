import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../container/Sidebar";
import Clients from "./Clients";
import Timesheet from "./Timesheet";
import MyProfilePage from "./MyProfilePage";

function EmployeeDashboard() {
    const employee_id = localStorage.getItem("employee_id");
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <Routes>
                    <Route path="/" element={<Navigate to="clients" />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="timesheet" element={<Timesheet />} />
                    <Route path="my-profile/:employee_id" element={<MyProfilePage />} />
                </Routes>
            </div>
        </div>
    );
}

export default EmployeeDashboard;