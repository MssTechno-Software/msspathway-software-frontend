import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../container/Sidebar";
import Clients from "./Clients";
import Timesheet from "./Timesheet";
import AddClient from "./AddClient";
import LeaveRequests from "./LeaveRequest";
import Employee from "./Employee";
import AddEmployee from "./AddEmployee";
import EmployeeProfile from "./EmployeeProfile";
import MyProfilePage from "./MyProfilePage";

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
                    <Route path="employees/:employee_id" element={<EmployeeProfile />} />
                    <Route path="leave-requests" element={<LeaveRequests />} />
                    <Route path="add-client" element={<AddClient />} />
                    <Route path="my-profile/:employee_id" element={<MyProfilePage />} />
                </Routes>
            </div>

        </div>
    );
}
export default Dashboard;