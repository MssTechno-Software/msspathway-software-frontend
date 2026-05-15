import { NavLink, useNavigate } from "react-router-dom";

import {
    FiUsers,
    FiClock,
    FiArrowLeft,
    FiUser,
    FiChevronLeft,
    FiChevronRight,
    FiLogOut
} from "react-icons/fi";

import { FaUserTie } from "react-icons/fa";

import { useState } from "react";

function Sidebar({ children }) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const employee_id = localStorage.getItem("employee_id");

    const [openSidebar, setOpenSidebar] = useState(true);

    const handleBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("employee_id");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-[#f7f8fa]">

            {/* MOBILE OVERLAY */}
            {openSidebar && (
                <div
                    className="
                    fixed
                    inset-0
                    bg-black/30
                    z-40
                    lg:hidden
                "
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                fixed lg:sticky
                top-0
                left-0
                h-screen
                lg:h-auto
                lg:min-h-screen
                bg-[#301E0F]
                text-white
                z-50
                transition-all
                duration-300
                flex
                flex-col
                shrink-0

                ${openSidebar
                        ? "w-64"
                        : "w-20"
                    }
            `}
            >

                {/* TOGGLE BUTTON */}
                <button
                    onClick={() =>
                        setOpenSidebar(!openSidebar)
                    }
                    className="
                    absolute
                    top-5
                    -right-5
                    bg-green-800
                    text-white
                    shadow-lg
                    rounded-full
                    p-2.5
                    z-50
                "
                >
                    {openSidebar ? (
                        <FiChevronLeft size={20} />
                    ) : (
                        <FiChevronRight size={20} />
                    )}
                </button>

                <div className="p-4 h-full flex flex-col">

                    {/* HEADER */}
                    <div
                        className={`
                        flex items-center
                        ${openSidebar
                                ? "gap-3"
                                : "justify-center"
                            }
                        mb-10
                        border-b
                        border-white/10
                        pb-6
                    `}
                    >

                        <button
                            onClick={handleBack}
                            className="
                            flex items-center justify-center
                            w-10 h-10
                        "
                        >
                            <FiArrowLeft size={22} />
                        </button>

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

                    {/* KEEP YOUR NAVIGATION CODE HERE */}
                    <nav className="space-y-2 flex-1">

                        {/* MY PROFILE */}
                        <NavLink
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
                                ${isActive
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

                        {/* CLIENTS */}
                        <NavLink
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
                                ${isActive
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
                                ${isActive
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
                                    ${isActive
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
                    </nav>

                    {/* LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        className="
                            mt-6
                            flex items-center justify-center gap-3
                            w-full
                            px-4 py-3
                            rounded-xl
                            bg-green-800 hover:bg-green-700
                            transition-all duration-200
                        "
                    >
                        <FiLogOut size={20} />

                        {openSidebar && (
                            <span>Logout</span>
                        )}
                    </button>

                </div>
            </aside>

            {/* PAGE CONTENT */}
            <main
                className="
                flex-1
                overflow-x-hidden
                overflow-auto
                w-full
                pl-20
                lg:pl-0
            "
            >
                {children}
            </main>
        </div>
    );
}

export default Sidebar;

