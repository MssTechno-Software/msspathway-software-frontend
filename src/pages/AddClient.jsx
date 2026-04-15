import { useState, useEffect } from "react";
import { FiUser, FiPhone, FiFlag, FiClipboard, FiClock, FiChevronDown, FiCode } from "react-icons/fi";

function AddClient({ onClose, onAdd, editingClient, setPopup }) {

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        tech: [],
        status: "Active",
        employeeId: "",
        notes: ""
    });

    const [showTechDropdown, setShowTechDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

    const techOptions = [
        "React",
        "Angular",
        "Vue",
        "Node.js",
        "Java",
        "Spring Boot",
        "Python",
        "Django",
        "Flask",
        ".NET",
        "javaScript",
        "TypeScript",
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "DevOps",
        "Cloud Computing",
        "AWS",
        "Azure",
        "Google Cloud",
        "Cybersecurity",
    ];

    const statusMap = {
        Active: "A",
        Completed: "C",
        Pause: "P",
        Terminate: "T"
    };

    // When editing, load previous client data
    useEffect(() => {
        if (editingClient) {
            setFormData({
                name: editingClient.client_name || "",
                mobile: editingClient.mobile || "",
                tech: editingClient.technology
                    ? editingClient.technology.split(",")
                    : [],
                status: statusMap[editingClient.status] || "A",
                employeeId: editingClient.assigned_user_id || "",
                notes: ""
            });
        }
    }, [editingClient]);

    //Handle form input changes
    const handleChange = (e) => {
        let { name, value } = e.target;

        // For mobile, only allow numbers and certain symbols
        if (name === "mobile") {
            value = value.replace(/[^0-9+\-\s()]/g, "");
        }

        // ✅ Trim multiple spaces → single space
        value = value.replace(/\s+/g, " ");

        // ✅ Limit notes to 500 chars
        if (name === "notes") {
            value = value.slice(0, 500);
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const toggleTech = (tech) => {
        setFormData((prev) => ({
            ...prev,
            tech: prev.tech.includes(tech)
                ? prev.tech.filter((t) => t !== tech)
                : [...prev.tech, tech]
        }));
    };

    //submit new or edited client
    const submit = () => {

        // ✅ Trim all values before validation
        const trimmedData = {
            ...formData,
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            tech: formData.tech,
            status: formData.status,
            employeeId: formData.employeeId
        };
        if (
            !trimmedData.name ||
            !trimmedData.mobile ||
            trimmedData.tech.length === 0 ||
            !trimmedData.status ||
            !trimmedData.employeeId
        ) {
            setPopup({
                show: true,
                message: "Please fill all required fields!",
                type: "error"
            });

            return;
        }
        const client = {
            ...trimmedData
        };
        onAdd(client);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] mx-2">

                {/* HEADER */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {editingClient ? "Update Client" : "Add New Client"}
                        </h2>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-5">

                    {/* Client Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Client Name <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                            <FiUser className="text-gray-400 mr-2" />
                            <input
                                name="name"
                                value={formData.name}
                                placeholder="e.g. Acme Corporation"
                                onChange={handleChange}
                                className="w-full py-3 outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                            <FiPhone className="text-gray-400 mr-2" />
                            <input
                                name="mobile"
                                value={formData.mobile}
                                placeholder="+1 (555) 000-0000"
                                onChange={handleChange}
                                className="w-full py-3 outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Tech + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">
                                Technology Stack <span className="text-red-500">*</span>
                            </label>

                            {/* Dropdown Button */}
                            <div
                                onClick={() => setShowTechDropdown(!showTechDropdown)}
                                className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3 py-3 cursor-pointer"
                            >
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <FiCode className="text-gray-400" />
                                    <span className="text-sm text-gray-700 truncate cursor-pointer">
                                        {formData.tech.length > 0
                                            ? formData.tech.join(", ")
                                            : "Select technologies"}
                                    </span>
                                </div>
                                <FiChevronDown
                                    className={`text-gray-500 transition-transform duration-200 
                                    ${showTechDropdown ? "rotate-180" : ""}`}
                                />
                            </div>

                            {/* Dropdown List */}
                            {showTechDropdown && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow max-h-40 overflow-y-auto">
                                    {techOptions.map((tech) => (
                                        <label
                                            key={tech}
                                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.tech.includes(tech)}
                                                onChange={() => toggleTech(tech)}
                                                className="mr-2 accent-green-700"
                                            />
                                            {tech}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">
                                Initial Status <span className="text-red-500">*</span>
                            </label>

                            <div
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3 py-3 cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-2">
                                    <FiFlag className="text-gray-400" />
                                    <span className="text-sm text-gray-700">
                                        {formData.status || "Select Status"}
                                    </span>
                                </div>
                                <FiChevronDown
                                    className={`text-gray-500 transition-transform duration-200 
                                    ${showStatusDropdown ? "rotate-180" : ""}`}
                                />

                            </div>
                            {showStatusDropdown && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow">
                                    {["Active", "Completed", "Pause", "Terminate"].map((item) => (
                                        <label key={item} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={formData.status === item}
                                                onChange={() => {
                                                    setFormData({ ...formData, status: item });
                                                    setShowStatusDropdown(false);
                                                }}
                                                className="mr-2 accent-green-700"
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timezone */}
                    {/* <div className="relative">
                        <label className="text-sm font-medium text-gray-700">
                            Timezone <span className="text-red-500">*</span>
                        </label>

                        <div
                            onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                            className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3 py-3 cursor-pointer select-none"
                        >
                            <div className="flex items-center gap-2">
                                <FiClock className="text-gray-400" />
                                <span className="text-sm text-gray-700">{formData.timezone || "Select Timezone"}</span>
                            </div>
                            <FiChevronDown
                                className={`text-gray-500 transition-transform duration-200 
                                ${showTimezoneDropdown ? "rotate-180" : ""}`}
                            />
                        </div>
                        {showTimezoneDropdown && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow">
                                {["IST", "UTC", "PST"].map((tz) => (
                                    <label key={tz} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.timezone === tz}
                                            onChange={() => {
                                                setFormData({ ...formData, timezone: tz });
                                                setShowTimezoneDropdown(false);
                                            }}
                                            className="mr-2 accent-green-700"
                                        />
                                        {tz}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div> */}

                    {/* Employee ID */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700">
                            Assigned To (Employee ID) <span className="text-red-500">*</span>
                        </label>

                        <div
                            onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                            className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3 py-3 cursor-pointer select-none"
                        >
                            <div className="flex items-center gap-2">
                                <FiClock className="text-gray-400" />
                                <span className="text-sm text-gray-700">{formData.employeeId || "Select Employee ID"}</span>
                            </div>
                            <FiChevronDown
                                className={`text-gray-500 transition-transform duration-200 
                                ${showEmployeeDropdown ? "rotate-180" : ""}`}
                            />
                        </div>
                        {showEmployeeDropdown && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow">
                                {[1, 2, 3, 4, 5].map((tz) => (
                                    <label key={tz} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.employeeId === tz}
                                            onChange={() => {
                                                setFormData({ ...formData, employeeId: tz });
                                                setShowEmployeeDropdown(false);
                                            }}
                                            className="mr-2 accent-green-700"
                                        />
                                        {tz}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">
                                Notes / Description
                            </label>

                            <p
                                className={`text-xs mt-1 text-right 
                                ${formData.notes.length === 500 ? "text-red-500" : "text-gray-500"}`}
                            >
                                {formData.notes.length}/500
                            </p>
                        </div>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            placeholder="Add additional details or context about this client..."
                            onChange={handleChange}
                            rows="4"
                            maxLength={500}
                            className="w-full mt-2 border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm outline-none"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-6 p-4 sm:p-6 border-t border-gray-200">

                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-black"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={submit}
                        className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
                    >
                        {editingClient ? "Update Client" : "Add Client"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default AddClient;