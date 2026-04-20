import { Link } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

  const menu = {
    admin: [
      { name: "All Clients", path: "clients" },
      { name: "Timesheets", path: "timesheet" },
      { name: "Leave Requests", path: "leave-requests" },
    ],
    software_admin: [
      { name: "Timesheets", path: "timesheet" },
      { name: "Leave Requests", path: "leave-requests" },
      { name: "Apply Leave", path: "apply-leave" },
    ],
    software_user: [
      { name: "Timesheet", path: "timesheet" },
      { name: "Apply Leave", path: "apply-leave" },
    ],
    pathway_user: [
      { name: "Assigned Clients", path: "assigned-clients" },
      { name: "Timesheets", path: "timesheet" },
    ],
    pathway_admin: [
      { name: "All Clients", path: "clients" },
      { name: "Leave Requests", path: "leave-requests" },
    ],
  };

  const items = menu[role] || [];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-lg font-bold mb-6 uppercase">{role}</h2>

      <nav className="flex flex-col space-y-4">
        {items.map((item) => (
          <Link key={item.path} to={`/dashboard/${item.path}`}>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;