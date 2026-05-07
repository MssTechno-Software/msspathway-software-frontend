import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function AddReport({ onClose, onSave, editData }) {

    const STAGES = ["Call", "Mail", "L1", "L2", "Offer"];

    const isEdit = !!editData;

    const today = new Date().toISOString().split("T")[0];
    const [stageOpen, setStageOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        company: "",
        recruiterName: "",
        recruiterContact: "",
        recruiterEmail: "",
        stage: "Call",
        status: "Pending",
        date: today,
        notes: ""
    });

    // Prefill on edit
    useEffect(() => {
        if (editData) {
            setForm({
                company: editData.company || "",
                recruiterName: editData.recruiterName || "",
                recruiterContact: editData.recruiterContact || "",
                recruiterEmail: editData.recruiterEmail || "",
                stage: editData.stage || "Call",
                status: editData.status || "Pending",
                date: editData.date || today,
                notes: editData.notes || ""
            });
        }
    }, [editData]);

    const getAllowedStages = () => {
        if (!editData) return ["Call"];

        const index = STAGES.indexOf(editData.stage);

        // If pending → stay here
        if (editData.status === "Pending") {
            return [editData.stage];
        }

        //  If rejected → stop
        if (editData.status === "Rejected") {
            return [editData.stage];
        }

        // If cleared → allow next stage
        return STAGES.slice(0, index + 2); // allow current + next stage
    };

    const validateForm = () => {
        let newErrors = {};
        if (!isEdit) {
            if (!form.company.trim()) newErrors.company = "Company is required";
            if (!form.recruiterName.trim()) newErrors.recruiterName = "Recruiter name is required";
            if (!form.recruiterContact.trim()) newErrors.recruiterContact = "Recruiter contact is required";
            if (!form.recruiterEmail.trim()) newErrors.recruiterEmail = "Recruiter email is required";
            if (!form.stage) newErrors.stage = "Stage is required";
            if (!form.status) newErrors.status = "Status is required";
            if (!form.date) newErrors.date = "Date is required";
        }
        if (form.recruiterContact.trim()) {
            if (!/^\d{10}$/.test(form.recruiterContact.trim())) {
                newErrors.recruiterContact = "Contact must be a 10-digit number";
            }
        }

        if (form.recruiterEmail.trim()) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recruiterEmail.trim())) {
                newErrors.recruiterEmail = "Invalid email format";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start sm:items-center z-50 p-2 sm:p-4 overflow-y-auto">

            <div className="bg-white w-full rounded-2xl max-w-lg sm:max-w-xl md:max-w-2xl shadow-xl flex flex-col max-h-[95vh] mx-2">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? "Update Report Status" : "Add New Report Entry"}
                    </h2>
                </div>

                {/* BODY */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-5">

                    {/* COMPANY */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Company Name {!isEdit && <span className="text-red-500">*</span>}
                        </label>
                            <input
                                placeholder="Enter company name"
                                value={form.company}
                                onChange={(e) => setForm({...form, company: e.target.value})}
                                disabled={isEdit}
                                className={`w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none
                                ${errors.company ? "border-red-500" : "border-gray-200"}`}
                            />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* RECRUITER NAME */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Recruiter Name {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                placeholder="Enter recruiter name"
                                value={form.recruiterName}
                                onChange={(e) => setForm({...form, recruiterName: e.target.value})}
                                className={`w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none
                                    ${errors.recruiterName ? "border-red-500" : "border-gray-200"}`}
                            />
                        </div>

                        {/* RECRUITER CONTACT */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Recruiter Contact {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                placeholder="Enter recruiter contact"
                                value={form.recruiterContact}
                                onChange={(e) => setForm({...form, recruiterContact: e.target.value})}
                                className={`w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none
                                    ${errors.recruiterContact ? "border-red-500" : "border-gray-200"}`}
                            />
                        </div>
                    </div>

                    {/* RECRUITER EMAIL */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Recruiter Email {!isEdit && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            placeholder="Enter recruiter email"
                            value={form.recruiterEmail}
                            onChange={(e) => setForm({...form, recruiterEmail: e.target.value})}
                            className={`w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none
                                ${errors.recruiterEmail ? "border-red-500" : "border-gray-200"}`}
                        />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* STAGE */}

                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">
                                Interview Stage {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <div
                                onClick={() => setStageOpen(!stageOpen)}
                                className={`flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 p-3 cursor-pointer
                                    ${errors.stage ? "border-red-500" : "border-gray-200"}`}
                            >
                                <span className="text-sm text-gray-700 truncate cursor-pointer">{form.stage}</span>
                                <FiChevronDown className={`text-gray-500 transition-transform duration-200 
                                    ${stageOpen ? "rotate-180" : ""}`} />
                                
                            </div>

                            {stageOpen && (
                                <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-2 shadow z-10">
                                    {STAGES.map((stage) => (
                                        <label
                                            key={stage}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="stage"
                                                checked={form.stage === stage}
                                                onChange={() => {
                                                    setForm({ ...form, stage });
                                                    setStageOpen(false);
                                                    setErrors({ ...errors, stage: "" });
                                                }}
                                                className="accent-green-700"
                                            />
                                            <span className="text-sm">{stage}</span>
                                        </label>
                                    ))} 
                                </div>
                            )}
                            {errors.stage && <p className="text-red-500 text-sm">{errors.stage}</p>}
                        </div>

                        {/* STATUS */}
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">
                                Interview Status {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <div
                                onClick={() => setStatusOpen(!statusOpen)}
                                className={`border rounded-xl p-3 mt-2 cursor-pointer bg-gray-50 flex justify-between items-center
                                    ${errors.status ? "border-red-500" : "border-gray-200"}`}
                            >
                                <span className="text-sm text-gray-700 truncate cursor-pointer">{form.status}</span>
                                <FiChevronDown className={`text-gray-500 transition-transform duration-200 
                                    ${statusOpen ? "rotate-180" : ""}`} />
                            </div>

                            {statusOpen && (
                                <div className="absolute w-full bg-white border border-gray-200 rounded-xl mt-1 shadow z-10">
                                    {["Pending", "Cleared", "Rejected", "Skipped"].map(status => (
                                        <label
                                            key={status}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={form.status === status}
                                                onChange={() => {
                                                    setForm({ ...form, status });
                                                    setStatusOpen(false);
                                                    setErrors({ ...errors, status: "" });
                                                }}
                                                className="accent-green-700"
                                            />
                                            <span className="text-sm">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                        </div>
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Date {!isEdit && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => {
                                setForm({ ...form, date: e.target.value });
                                setErrors({ ...errors, date: "" });
                            }}
                            className={`w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none
                                ${errors.date ? "border-red-500" : "border-gray-200"}`}
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    {/* NOTES */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">
                                Internal Notes
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
                            placeholder="Enter interview notes..."
                            value={form.notes}
                            onChange={(e) => {
                                setForm({ ...form, notes: e.target.value });
                                setErrors({ ...errors, notes: "" });
                            }}
                            maxLength={500}
                            className="w-full mt-2 border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none resize-none h-24"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-200 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-green-800 text-white px-5 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                    >
                        {isEdit ? "Update" : "Save Entry"}
                    </button>
                </div>

            </div>
        </div>
    );
}