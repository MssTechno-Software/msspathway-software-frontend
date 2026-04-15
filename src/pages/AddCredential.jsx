import { useState, useEffect } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLink } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";

function AddCredential({ onClose, onSave, editingData }) {

    const [form, setForm] = useState({
        portal: "",
        portalLink: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        message: "",
        type: ""
    });

    useEffect(() => {
        if (editingData) {
            setForm({
                portal: editingData.portal || "",
                portalLink: editingData.portalLink || "",
                email: editingData.email || "",
                password: editingData.password || ""
            });
        }
    }, [editingData]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError({
            ...error,
            [e.target.name]: ""
        });
    };

    //validation can be added here before submission
    const validate = () => {
        let newError = {};

        if (!form.portal.trim()) {
            newError.portal = "Portal name is required";
        }

        if (!form.portalLink.trim()) {
            newError.portalLink = "Portal link is required";
        } else if (!/^https?:\/\/\S+$/.test(form.portalLink)) {
            newError.portalLink = "Portal link must be a valid URL";
        }

        if (!form.email.trim()) {
            newError.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newError.email = "Email address is invalid";
        }

        if (!form.password.trim()) {
            newError.password = "Password is required";
        }else if (form.password.length < 8) {
            newError.password = "Password must be at least 8 characters";
        }

        setError(newError);
        return newError;
    };

    const handleSubmit = () => {
        const error = validate();
        
        if (Object.keys(error).length > 0) {
            const message = Object.values(error).join("\n");
            setPopup({
                show: true,
                message:Object.values(error).join("\n"),
                type: "error"
            });
            return;
        }
        
        onSave(form);
        setPopup({
            show: true,
            message: editingData ? "Credential updated successfully." : "Credential saved successfully.",
            type: "success"
        });

        setForm({
            portal: "",
            portalLink: "",
            email: "",
            password: ""
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-120 rounded-2xl shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingData ? "Update Credential" : "Add Credential"}
                    </h2>
                </div>

                {/* BODY */}
                <div className="px-6 pb-6 space-y-5">

                    {/* PORTAL */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Portal Name <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                            <BsBuilding className="text-gray-400 mr-2" />
                            <input
                                name="portal"
                                value={form.portal}
                                onChange={handleChange}
                                placeholder="e.g. SalesForce, AWS"
                                className="w-full py-3 outline-none bg-transparent"
                            />
                        </div>

                    </div>

                    {/* PORTAL LINK*/}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Portal Link <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                            <FiLink className="text-gray-400 mr-2" />
                            <input
                                name="portalLink"
                                value={form.portalLink}
                                onChange={handleChange}
                                placeholder="https://portal.example.com"
                                className="w-full py-3 outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                            <FiMail className="text-gray-400 mr-2" />
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full py-3 outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                            <FiLock className="text-gray-400 mr-2" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full py-3 outline-none bg-transparent"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-4 pt-2">

                        <button
                            onClick={onClose}
                            className="flex-1 border border-gray-300 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-green-800 hover:bg-green-700 text-white py-3 rounded-xl shadow-md"
                        >
                            {editingData ? "Update" : "Save"}
                        </button>

                    </div>

                </div>

                {/* FOOTER */}
                <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500 flex items-start gap-2">
                    <span>ℹ</span>
                    <p>
                        These credentials will be encrypted using industry-standard AES-256
                        protocols before being stored in our secure vault.
                    </p>
                </div>

            </div>

            {popup.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">

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

export default AddCredential;