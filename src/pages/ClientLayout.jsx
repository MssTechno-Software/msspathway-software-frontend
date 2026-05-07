import {
  useParams,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  FiFileText,
  FiKey,
  FiBarChart2,
  FiUser,
  FiGrid,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { useState, useEffect } from "react";

function ClientLayout() {
  const { client_id } = useParams();

  const [clientName, setClientName] = useState("");
  const [openSidebar, setOpenSidebar] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  useEffect(() => {
    if (location.state?.clientName) {
      localStorage.setItem(
        `clientName_${client_id}`,
        location.state.clientName
      );

      setClientName(location.state.clientName);
    } else {
      const storedName = localStorage.getItem(
        `clientName_${client_id}`
      );

      if (storedName) setClientName(storedName);
    }
  }, [location.state, client_id]);

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div
        className={`
          relative
          bg-[#301E0F]
          text-white
          flex flex-col justify-between
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

        <div>

          {/* HEADER */}
          <div className="px-4 py-6 border-b border-white/10">

            <div className="flex items-center gap-3">

              <FiArrowLeft
                size={20}
                className="cursor-pointer hover:text-gray-300"
                onClick={() => navigate("/dashboard/clients")}
              />

              {openSidebar && (
                <div>
                  <h1 className="text-2xl font-semibold truncate">
                    {clientName}
                  </h1>

                  <p className="text-md text-gray-300">
                    Client Dashboard
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* MENU */}
          <div className="mt-4 space-y-1">

            {/* CLIENT PROFILE */}
            <div
              onClick={() => navigate(`/clients/${client_id}`)}
              className={`
                flex items-center gap-3 px-6 py-3 cursor-pointer
                ${
                  !location.pathname.includes("applications") &&
                  !location.pathname.includes("credentials") &&
                  !location.pathname.includes("reports") &&
                  !location.pathname.includes("overview")
                    ? "border-l-4 border-green-800 bg-white/10"
                    : "hover:bg-white/10"
                }
              `}
            >
              <FiUser size={20} />

              {openSidebar && <span>Client Profile</span>}
            </div>

            {/* APPLICATIONS */}
            <div
              onClick={() =>
                navigate(`/clients/${client_id}/applications`, {
                  state: { clientName },
                })
              }
              className={`
                flex items-center gap-3 px-6 py-3 cursor-pointer
                ${
                  isActive("applications")
                    ? "border-l-4 border-green-800 bg-white/10"
                    : "hover:bg-white/10"
                }
              `}
            >
              <FiFileText size={20} />

              {openSidebar && <span>Applications</span>}
            </div>

            {/* CREDENTIALS */}
            <div
              onClick={() =>
                navigate(`/clients/${client_id}/credentials`, {
                  state: { clientName },
                })
              }
              className={`
                flex items-center gap-3 px-6 py-3 cursor-pointer
                ${
                  isActive("credentials")
                    ? "border-l-4 border-green-800 bg-white/10"
                    : "hover:bg-white/10"
                }
              `}
            >
              <FiKey size={20} />

              {openSidebar && <span>Credentials</span>}
            </div>

            {/* REPORTS */}
            <div
              onClick={() =>
                navigate(`/clients/${client_id}/reports`, {
                  state: { clientName },
                })
              }
              className={`
                flex items-center gap-3 px-6 py-3 cursor-pointer
                ${
                  isActive("reports")
                    ? "border-l-4 border-green-800 bg-white/10"
                    : "hover:bg-white/10"
                }
              `}
            >
              <FiBarChart2 size={20} />

              {openSidebar && <span>Reports</span>}
            </div>

            {/* OVERVIEW */}
            <div
              onClick={() =>
                navigate(`/clients/${client_id}/overview`, {
                  state: { clientName },
                })
              }
              className={`
                flex items-center gap-3 px-6 py-3 cursor-pointer
                ${
                  isActive("overview")
                    ? "border-l-4 border-green-800 bg-white/10"
                    : "hover:bg-white/10"
                }
              `}
            >
              <FiGrid size={20} />

              {openSidebar && <span>Overview</span>}
            </div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ClientLayout;