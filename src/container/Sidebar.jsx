import { NavLink } from "react-router-dom";
import { FiUsers, FiClock } from "react-icons/fi";

function Sidebar() {
    return (
        <div className="w-54 bg-[#301E0F] text-white flex flex-col p-4">

            {/* Logo */}
            <h2 className="text-lg font-semibold mb-8">MSS Techno</h2>

            {/* Menu */}
            <nav className="flex flex-col gap-3">

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

            </nav>
        </div>
    );
}

export default Sidebar;