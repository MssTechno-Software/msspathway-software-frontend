import { useState, useEffect } from "react";
import { FiX, FiLink, FiCalendar, FiChevronDown } from "react-icons/fi";

function AddApplication({ onClose, onAdd, editingApp }) {

    const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({
        company: "",
        role: "",
        platform: "",
        date: today,
        link: "",
        notes: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (editingApp) {
            setForm({
                company: editingApp.company || "",
                role: editingApp.role || "",
                platform: editingApp.platform || "",
                date: editingApp.date || today,
                link: editingApp.link || "",
                notes: editingApp.notes || ""
            });
        }
    }, [editingApp]);

    const handleSubmit = () => {

        let newErrors = {};

        if (!form.company.trim()) newErrors.company = "Company is required";
        if (!form.role.trim()) newErrors.role = "Role is required";
        if (!form.platform || form.platform === "Select a platform")
            newErrors.platform = "Platform is required";
        if (!form.date) newErrors.date = "Date is required";
        if (!form.link.trim()) newErrors.link = "Link is required";

        setErrors(newErrors);

        //stop if any error
        if (Object.keys(newErrors).length > 0) return;

        onAdd(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl shadow-xl overflow-hidden mx-2">

                {/* HEADER */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingApp ? "Update Application" : "Add New Application Entry"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Keep track of your career journey. Fill in the job details below.
                        </p>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-4 sm:p-6 space-y-5">

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                                className="w-full mt-2 border rounded-xl p-3 bg-gray-50 outline-none border-gray-200"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Role of Application <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                placeholder="e.g. Senior Designer"
                                className="w-full mt-2 border rounded-xl p-3 bg-gray-50 outline-none border-gray-200"
                            />
                        </div>

                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">
                                Select Platform <span className="text-red-500">*</span>
                            </label>

                            <div
                                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                                className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3 py-3 cursor-pointer"
                            >
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm text-gray-700 truncate cursor-pointer">
                                        {form.platform || "Select a platform"}
                                    </span>
                                </div>
                                <FiChevronDown className={`text-gray-500 transition-transform duration-200 
                                    ${showPlatformDropdown ? "rotate-180" : ""}`} />
                            </div>
                            {showPlatformDropdown && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow">
                                    {["Naukri", "LinkedIn", "Career Pages","Cold Emails", "Other"].map((item) => (
                                        <label key={item} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="platform"
                                                checked={form.platform === item}
                                                onChange={() => {
                                                    setForm({ ...form, platform: item });
                                                    setShowPlatformDropdown(false);
                                                }}
                                                className="mr-2 accent-green-700"
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            )}

                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Date Applied <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    min={today}
                                    max={today}
                                    onChange={handleChange}
                                    className={`w-full mt-2 border rounded-xl p-3 bg-gray-50 outline-none 
                                    ${errors.date ? "border-red-500" : "border-gray-200"}`}
                                />

                            </div>

                        </div>

                    </div>

                    {/* Link */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Application Link <span className="text-red-500">*</span>
                        </label>

                        <div
                            className="flex items-center mt-2 h-11 px-3 rounded-xl bg-gray-50 border border-gray-200"
                        >
                            <FiLink className="text-gray-400 mr-2" />

                            <input
                                name="link"
                                value={form.link}
                                onChange={handleChange}
                                placeholder="https://company.com/careers/job-123"
                                className="w-full h-full outline-none bg-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">
                                Internal Notes (Optional)
                            </label>
                            <p
                                className={`text-xs mt-1 text-right 
                                    ${form.notes.length === 500 ? "text-red-500" : "text-gray-500"}`}
                            >
                                {form.notes.length}/500
                            </p>
                        </div>

                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Mention referral, specific recruiter, etc."
                            rows="4"
                            maxLength={500}
                            className="w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-6">

                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-black"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md"
                    >
                        {editingApp ? "Update" : "Save"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default AddApplication;