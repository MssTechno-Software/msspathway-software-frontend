import { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { FiFileText, FiKey, FiBarChart2, FiSearch } from "react-icons/fi";
import axios from "axios";
import AddApplication from "./AddApplication";

const API = axios.create({
    baseURL: "https://timesheet-api-790373899641.asia-south1.run.app",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function Applications() {

    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("Naukri");
    const [clientName, setClientName] = useState("");
    const [previousCounts, setPreviousCounts] = useState({});
    const [pageMap, setPageMap] = useState({});
    const ITEMS_PER_PAGE = 5;

    const [popup, setPopup] = useState(
        { 
            show: false, 
            message: "", 
            type: "" 
        }
    );

    const navigate = useNavigate();
    const { client_id } = useParams();
    const location = useLocation();
    const isSubPage =
        location.pathname.includes("credentials") ||
        location.pathname.includes("reports");

    // Fetch applications
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await API.get(`/applications/applications/${client_id}`);
                console.log("Fetched applications:", res.data);

                const appsObject = res.data?.applications || {};

                // convert object → array + add platform
                const allApplications = Object.entries(appsObject).flatMap(([platform, apps]) =>
                    apps.map(app => ({ ...app, platform }))
                );

                const formatted = allApplications.map((app) => ({
                    id: app.id,
                    platform: app.platform,
                    company: app.company_name,
                    role: app.role,
                    date: app.date,
                    link: app.application_link,
                    notes: app.notes
                }));

                setApplications(formatted);
            } catch (err) {
                console.error("ERROR:", err.response?.data || err.message);
                setPopup({
                    show: true,
                    message: err.response?.data?.message || "Failed to fetch applications",
                    type: "error"
                });
            }
        };

        if (client_id) fetchApplications();
    }, [client_id]);

    const addApplication = async (app) => {

        if (!app.platform || !app.company || !app.role || !app.date || !app.link) {
            setPopup({
                show: true,
                message: "Please fill in all required fields",
                type: "error"
            });
            return;
        }

        const payload = {
            platform: app.platform,
            company_name: app.company,
            role: app.role,
            date_applied: new Date(app.date).toISOString().split("T")[0],
            application_link: app.link,
            notes: app.notes || ""
        };

        console.log("Adding application with payload:", payload);
        console.log("Client ID:", client_id);

        try {
            const response = await API.post(`/applications/create_application/${client_id}`, payload);
            console.log("post response:", response.data);

            const res = await API.get(`/applications/applications/${client_id}`);
            console.log("get response after adding application:", res.data);

            const appsObject = res.data?.applications || {};

            const allApplications = Object.entries(appsObject).flatMap(([platform, apps]) =>
                apps.map(app => ({ ...app, platform }))
            );

            const formatted = allApplications.map((app) => ({
                id: app.id,
                platform: app.platform,
                company: app.company_name,
                role: app.role,
                date: app.date,
                link: app.application_link,
                notes: app.notes
            }));

            setApplications(formatted);

            setPopup({
                show: true,
                message: "Application added successfully",
                type: "success"
            });

            setShowModal(false);

        } catch (err) {
            console.error("Full error:", err.response?.data || err.message);
            setPopup({
                show: true,
                message: err.response?.data?.message || "Failed to add application",
                type: "error"
            });
        }
    };

    useEffect(() => {
        const clients = JSON.parse(localStorage.getItem("clients")) || [];
        const currentClient = clients.find((c) => c.id === Number(client_id));
        if (currentClient) {
            setClientName(currentClient.name);
        }
    }, [client_id]);

    const platforms = ["Naukri", "LinkedIn", "Career Pages", "Cold Emails", "Other"];

    const currentCounts = platforms.reduce((acc, platform) => {
        acc[platform] = applications.filter(a => a.platform === platform).length;
        return acc;
    }, {});

    useEffect(() => {
        const prev = JSON.parse(localStorage.getItem(`prev_counts_${client_id}`)) || {};
        setPreviousCounts(prev);
    }, [client_id]);

    const getPercentage = (current, previous) => {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return Math.round(((current - previous) / previous) * 100);
    };

    const filteredApps = applications.filter(
        (app) => activeTab === "All" || app.platform?.toLowerCase() === activeTab.toLowerCase()
    );

    const currentPage = pageMap[activeTab] || 1;

    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);

    const paginatedApps = filteredApps.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex min-h-screen bg-white">

            {/* SIDEBAR */}
            <div className="w-full md:w-54 bg-[#301E0F] text-white flex flex-col justify-between">

                <div>
                    {/* LOGO */}
                    <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                        <div className="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">▦</span>
                        </div>
                        <h2 className="text-xl font-semibold">{clientName}</h2>
                    </div>
                    
                    {/* MENU */}
                    <div className="mt-4 space-y-1">
                        {/* Applications */}
                        <div
                            onClick={() => navigate(`/applications/${client_id}`)}
                            className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
                            ${!isSubPage ? "border-l-4 border-green-800" : "hover:border-l-4 border-green-800 cursor-pointer"}`}
                        >
                            <FiFileText/>
                            <span>Applications</span>
                        </div>

                        {/* Credentials */}
                        <div
                            onClick={() => navigate(`/applications/${client_id}/credentials`)}
                            className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
                            ${isSubPage && location.pathname.includes("credentials") ? "border-l-4 border-green-800" : "hover:border-l-4 border-green-800 cursor-pointer"}`}
                        >
                            <FiKey/>
                            <span>Credentials</span>
                        </div>
                       
                       {/* Reports */}
                        <div
                            onClick={() => navigate(`/applications/${client_id}/reports`)}
                            className={`flex items-center gap-3 px-6 py-3 cursor-pointer 
                            ${isSubPage && location.pathname.includes("reports") ? "border-l-4 border-green-800" : "hover:border-l-4 border-green-800 cursor-pointer"}`}
                        >
                            <FiBarChart2/>
                            <span>Reports</span>
                        </div>

                    </div>
                </div>

                {/* BOTTOM BUTTON */}
                <div className="p-4">
                    <button
                        onClick={() => navigate("/dashboard/clients")}
                        className="w-full bg-green-800 hover:bg-green-700 px-4 py-2 rounded-lg"
                    >
                        ← Back to Clients
                    </button>
                </div>

            </div>

            {/* MAIN */}
            <div className="flex-1 p-6">
                {isSubPage ? (
                    <Outlet />
                ) : (
                <>
                    {/* HEADER */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                        <h1 className="text-3xl font-bold">Applications</h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:w-auto">

                            {/* SEARCH */}
                            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full shadow-sm">
                                <FiSearch className="text-gray-400 mr-2" />
                                <input
                                    placeholder="Search applications..."
                                    className="outline-none"
                                />
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full sm:w-auto bg-green-800 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                            >
                                Add Application
                            </button>
                        </div>
                    </div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 bg-gray-100 p-6 rounded-2xl">

                        {platforms.map((item) => {
                            const current = currentCounts[item] || 0;
                            const previous = previousCounts[item] || 0;
                            const percent = getPercentage(current, previous);
                            const isPositive = percent >= 0;

                            return (
                                <div key={item} className="bg-white p-5 rounded-2xl hover:shadow-md transition-all">
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500 text-sm">{item}</p>

                                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                            isPositive
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-500"
                                            }`}
                                        >
                                            {isPositive ? `+${percent}%` : `${percent}%`}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl font-bold mt-3">
                                        {current}
                                    </h2>

                                    <div className="mt-3">
                                        <div className="h-10 flex items-end gap-1">
                                            {[4, 6, 5, 8, 7].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 rounded ${isPositive ? "bg-green-300" : "bg-red-300"
                                                        }`}
                                                    style={{ height: `${h * 4}px` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                            
                    {/* TABS */}
                    <div className="flex gap-6 border-b mb-4 overflow-x-auto">

                        {["Naukri", "LinkedIn", "Career Pages", "Cold Emails", "Other"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 ${activeTab === tab
                                        ? "border-b-2 border-green-600 text-green-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}

                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="p-4 text-left">WEBSITE NAME</th>
                                        <th className="p-4 text-left">DATE</th>
                                        <th className="p-4 text-left">ROLE</th>
                                        <th className="p-4 text-left">COMPANY</th>
                                        <th className="p-4 text-left">LINK</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredApps.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-10 text-gray-400">
                                                No applications found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedApps.map((app) => (

                                            <tr key={app.id} className="hover:bg-gray-50">

                                                <td className="p-4 font-medium">
                                                    {app.platform}
                                                </td>

                                                <td className="p-4">
                                                    {app.date}
                                                </td>

                                                <td className="p-4">
                                                    {app.role}
                                                </td>

                                                <td className="p-4">
                                                    {app.company}
                                                </td>

                                                <td className="p-4">
                                                    <a
                                                        href={app.link}
                                                        target="_blank"
                                                        className="text-green-700 font-medium"
                                                    >
                                                        View ↗
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">

                                {/* LEFT */}
                                <div className="text-sm text-gray-500">
                                    Showing {paginatedApps.length} of {filteredApps.length} applications
                                </div>

                                {/* RIGHT */}
                                <div className="flex items-center gap-2">

                                    {/* PREVIOUS */}
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setPageMap({
                                                ...pageMap,
                                                [activeTab]: Math.max(currentPage - 1, 1),
                                            })
                                        }
                                        className="px-3 py-1 rounded text-gray-600 bg-gray-100 disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    {/* PAGE */}
                                    <button className="bg-green-800 text-white px-3 py-1 rounded">
                                        {currentPage}
                                    </button>

                                    {/* NEXT */}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setPageMap({
                                                ...pageMap,
                                                [activeTab]: Math.min(currentPage + 1, totalPages),
                                            })
                                        }
                                        className="px-3 py-1 rounded text-gray-600 bg-gray-100 disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MODAL */}
                    {showModal && (
                        <AddApplication
                            onClose={() => setShowModal(false)}
                            onAdd={addApplication}
                        />
                    )}
                </> 
                )
                }
            </div>

            {popup.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white p-6 rounded-xl w-80 text-center shadow-lg">

                        <p className={`mb-4 font-semibold
                ${popup.type === "success" ? "text-green-600" : "text-red-600"}
            `}>
                            {popup.message}
                        </p>

                        <button
                            onClick={() => setPopup({ show: false })}
                            className="bg-green-800 text-white px-4 py-2 rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Applications;