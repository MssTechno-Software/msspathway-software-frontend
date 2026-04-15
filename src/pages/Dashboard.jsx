import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../container/Sidebar";
import Clients from "./Clients";
import Timesheet from "./Timesheet";
import AddClient from "./AddClient";
import LeaveRequests from "./LeaveRequest";

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
                    <Route path="leave-requests" element={<LeaveRequests />} />
                    <Route path="add-client" element={<AddClient />} />
                </Routes>
            </div>

        </div>
    );
}

export default Dashboard;