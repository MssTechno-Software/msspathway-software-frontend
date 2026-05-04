import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiClock, FiArrowLeft, FiUser } from "react-icons/fi";
import { FaUserTie} from "react-icons/fa";

function Sidebar() {
     const navigate = useNavigate();
     const employee_id = localStorage.getItem("employee_id");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("employee_id");
        navigate("/login");
    };
    return (
        <div className="w-62 bg-[#301E0F] text-white flex flex-col p-4">

            <div className="flex items-center gap-3 mb-8">

                {/* BACK ICON */}
                <FiArrowLeft
                    size={20}
                    className="cursor-pointer hover:text-gray-300"
                    onClick={handleLogout}
                    title="Logout"
                />

                {/* Logo */}
                <h2 className="text-2xl font-semibold">MSS Techno</h2>
            </div>

            {/* Menu */}
            <nav className="flex flex-col gap-3">
                <NavLink
                    to={`/dashboard/my-profile/${employee_id}`}
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? "bg-green-800" : "hover:bg-green-700"
                        }`
                    }
                >
                    <FiUser />
                    My Profile
                </NavLink>

                <NavLink
                    to="/dashboard/clients"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? "bg-green-800" : "hover:bg-green-700"
                        }`
                    }
                >
                    <FiUsers />
                    Clients
                </NavLink>

                <NavLink
                    to="/dashboard/timesheet"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? "bg-green-800" : "hover:bg-green-700"
                        }`
                    }
                >
                    <FiClock />
                    Timesheet
                </NavLink>

                <NavLink
                    to="/dashboard/employee"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? "bg-green-800" : "hover:bg-green-700"
                        }`
                    }
                >
                    <FaUserTie />
                    Employee
                </NavLink>

            </nav>
        </div>
    );
}

export default Sidebar;