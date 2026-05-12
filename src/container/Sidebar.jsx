import { NavLink, useNavigate } from "react-router-dom";

import {
    FiUsers,
    FiClock,
    FiArrowLeft,
    FiUser,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

import { FaUserTie } from "react-icons/fa";

import { useState } from "react";

function Sidebar({ children }) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const employee_id = localStorage.getItem("employee_id");

    const [openSidebar, setOpenSidebar] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("employee_id");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <div
                className={`
                    relative
                    bg-[#301E0F]
                    text-white
                    transition-all duration-300
                    ${openSidebar ? "w-64" : "w-20"}
                `}
            >

                {/* TOGGLE BUTTON */}
                <button
                    onClick={() => setOpenSidebar(!openSidebar)}
                    className="
                        absolute
                        -right-4
                        top-1/2
                        -translate-y-1/2
                        bg-green-800
                        text-white
                        shadow-md
                        rounded-full
                        p-2
                        z-50
                    "
                >
                    {openSidebar ? (
                        <FiChevronLeft size={18} />
                    ) : (
                        <FiChevronRight size={18} />
                    )}
                </button>

                <div className="p-4">

                    {/* HEADER */}
                    <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-6">

                        <FiArrowLeft
                            size={20}
                            className="cursor-pointer hover:text-gray-300"
                            onClick={handleLogout}
                            title="Logout"
                        />

                        {openSidebar && (
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    MSS Techno
                                </h2>

                                <p className="text-sm text-gray-300">
                                    Dashboard
                                </p>
                            </div>
                        )}
                    </div>

                    {/* MENU */}
                    <nav className="space-y-2">

                        {/* CLIENTS */}
                        <NavLink
                            //to="/dashboard/clients"
                            to={
                                role === "employee"
                                    ? "/employee-dashboard/clients"
                                    : "/dashboard/clients"
                            }
                            className={({ isActive }) =>
                                `
                                flex items-center gap-3
                                px-4 py-3 rounded-xl
                                transition-all duration-200
                                ${
                                    isActive
                                        ? "bg-green-800"
                                        : "hover:bg-green-700"
                                }
                                `
                            }
                        >
                            <FiUsers size={20} />

                            {openSidebar && (
                                <span>Clients</span>
                            )}
                        </NavLink>

                        {/* TIMESHEET */}
                        <NavLink
                            //to="/dashboard/timesheet"
                            to={
                                role === "employee"
                                    ? "/employee-dashboard/timesheet"
                                    : "/dashboard/timesheet"
                            }
                            className={({ isActive }) =>
                                `
                                flex items-center gap-3
                                px-4 py-3 rounded-xl
                                transition-all duration-200
                                ${
                                    isActive
                                        ? "bg-green-800"
                                        : "hover:bg-green-700"
                                }
                                `
                            }
                        >
                            <FiClock size={20} />

                            {openSidebar && (
                                <span>Timesheet</span>
                            )}
                        </NavLink>

                        {/* EMPLOYEE */}
                        {role !== "employee" && (
                            <NavLink
                                to="/dashboard/employee"
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3
                                    px-4 py-3 rounded-xl
                                    transition-all duration-200
                                    ${
                                        isActive
                                            ? "bg-green-800"
                                            : "hover:bg-green-700"
                                    }
                                    `
                                }
                            >
                                <FaUserTie size={20} />

                                {openSidebar && (
                                    <span>Employee</span>
                                )}
                            </NavLink>
                        )}

                        {/* MY PROFILE */}
                        <NavLink
                            //to={`/dashboard/my-profile/${employee_id}`}
                            to={
                                role === "employee"
                                    ? `/employee-dashboard/my-profile/${employee_id}`
                                    : `/dashboard/my-profile/${employee_id}`
                            }
                            className={({ isActive }) =>
                                `
                                flex items-center gap-3
                                px-4 py-3 rounded-xl
                                transition-all duration-200
                                ${
                                    isActive
                                        ? "bg-green-800"
                                        : "hover:bg-green-700"
                                }
                                `
                            }
                        >
                            <FiUser size={20} />

                            {openSidebar && (
                                <span>My Profile</span>
                            )}
                        </NavLink>
                    </nav>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}

export default Sidebar;