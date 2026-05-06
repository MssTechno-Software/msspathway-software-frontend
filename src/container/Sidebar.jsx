import { NavLink, useNavigate } from "react-router-dom";
import {
    FiUsers,
    FiClock,
    FiArrowLeft,
    FiUser,
    FiMenu,
    FiX
} from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import { useState } from "react";

function Sidebar() {
    const navigate = useNavigate();
    const employee_id = localStorage.getItem("employee_id");

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("employee_id");
        navigate("/login");
    };

    return (
        <>
            <button
                onClick={() => setOpenSidebar(true)}
                className="fixed top-4 left-4 z-50 bg-green-800 text-white p-2 rounded-md shadow-lg"
            >
                <FiMenu size={20} />
            </button>

            {/* OVERLAY */}
            {openSidebar && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-[#301E0F] text-white p-4 z-50 transform transition-transform duration-300
                ${openSidebar ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <FiArrowLeft
                            size={20}
                            className="cursor-pointer hover:text-gray-300"
                            onClick={handleLogout}
                            title="Logout"
                        />

                        <h2 className="text-2xl font-semibold">
                            MSS Techno
                        </h2>
                    </div>

                    {/* CLOSE BUTTON */}
                    <button onClick={() => setOpenSidebar(false)}>
                        <FiX size={20} />
                    </button>
                </div>

                {/* MENU */}
                <nav className="flex flex-col gap-3">
                    <NavLink
                        to={`/dashboard/my-profile/${employee_id}`}
                        onClick={() => setOpenSidebar(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl ${
                                isActive
                                    ? "bg-green-800"
                                    : "hover:bg-green-700"
                            }`
                        }
                    >
                        <FiUser />
                        My Profile
                    </NavLink>

                    <NavLink
                        to="/dashboard/clients"
                        onClick={() => setOpenSidebar(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl ${
                                isActive
                                    ? "bg-green-800"
                                    : "hover:bg-green-700"
                            }`
                        }
                    >
                        <FiUsers />
                        Clients
                    </NavLink>

                    <NavLink
                        to="/dashboard/timesheet"
                        onClick={() => setOpenSidebar(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl ${
                                isActive
                                    ? "bg-green-800"
                                    : "hover:bg-green-700"
                            }`
                        }
                    >
                        <FiClock />
                        Timesheet
                    </NavLink>

                    <NavLink
                        to="/dashboard/employee"
                        onClick={() => setOpenSidebar(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl ${
                                isActive
                                    ? "bg-green-800"
                                    : "hover:bg-green-700"
                            }`
                        }
                    >
                        <FaUserTie />
                        Employee
                    </NavLink>
                </nav>
            </div>
        </>
    );
}

export default Sidebar;