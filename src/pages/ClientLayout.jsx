import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { FiFileText, FiKey, FiBarChart2, FiUser, FiGrid, FiArrowLeft } from "react-icons/fi";
import { useState, useEffect } from "react";

function ClientLayout() {
  const { client_id } = useParams();
  const [clientName, setClientName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname.includes(path);

  useEffect(() => {
    if (location.state?.clientName) {
      localStorage.setItem(`clientName_${client_id}`, location.state.clientName);
      setClientName(location.state.clientName);
    } else {
      const storedName = localStorage.getItem(`clientName_${client_id}`);
      if (storedName) setClientName(storedName);
    }
  }, [location.state, client_id]);
  
  return (
    <div className="flex min-h-screen bg-[#F6F4F2]">

      {/* SIDEBAR */}
      <div className="w-62 bg-[#301E0F] text-white flex flex-col justify-between">

        <div>
          <div className="px-6 py-6 border-b border-white/10 flex items-center gap-4">
            {/* BACK ICON */}
            <FiArrowLeft
              size={20}
              className="cursor-pointer hover:text-gray-300"
              onClick={() => navigate("/dashboard/clients")}
            />
            <div>
              <h1 className="text-2xl font-semibold truncate">
                {clientName}
              </h1>

              <p className="text-md text-gray-300">
                Client Dashboard
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1">

            {/* CLIENT PROFILE (DEFAULT) */}
            <div
              onClick={() => navigate(`/clients/${client_id}`)}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
              ${!location.pathname.includes("applications") &&
                !location.pathname.includes("credentials") &&
                !location.pathname.includes("reports") && 
                !location.pathname.includes("overview")
                ? "border-l-4 border-green-800"
                : "hover:border-l-4 border-green-800"
              }`}
            >
              <FiUser />
              <span>Client Profile</span>
            </div>

            {/* APPLICATIONS */}
            <div
              onClick={() => navigate(`/clients/${client_id}/applications`, {
                state: {clientName}
              })}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
              ${isActive("applications") ? "border-l-4 border-green-800" : "hover:border-l-4 border-green-800"}`}
            >
              <FiFileText />
              <span>Applications</span>
            </div>

            {/* CREDENTIALS */}
            <div
              onClick={() => navigate(`/clients/${client_id}/credentials`, {
                state:{clientName}
              })}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
              ${isActive("credentials") ? "border-l-4 border-green-700" : "hover:border-l-4 border-green-800"}`}
            >
              <FiKey />
              <span>Credentials</span>
            </div>

            {/* REPORTS */}
            <div
              onClick={() => navigate(`/clients/${client_id}/reports`,{
                state:{clientName}
              })}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
              ${isActive("reports") ? "border-l-4 border-green-700" : "hover:border-l-4 border-green-800"}`}
            >
              <FiBarChart2 />
              <span>Reports</span>
            </div>

            {/*overview*/}
            <div
              onClick={() => navigate(`/clients/${client_id}/overview`, {
                state:{clientName}
              })}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
              ${isActive("overview") ? "border-l-4 border-green-700" : "hover:border-l-4 border-green-800"}`}
            >
              <FiGrid size={18} />
              <span>Overview</span>
            </div>

          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default ClientLayout;