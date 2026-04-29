import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiChevronDown,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin
} from "react-icons/fi";

function AddEmployee({ onClose, onSave, editingEmployee }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    aadhaar_no: "",
    email: "",
    mobile: "",
    designation: "",
    startDate: "",
    endDate: "",
    photo: "",
    password: "",
    reporting_to: "",   
    hr: "",
    role: "Employee",
    location: ""
  });

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
  if (editingEmployee) {
    setForm({
      first_name: editingEmployee.first_name || "",
      last_name: editingEmployee.last_name || "",
      email: editingEmployee.email || "",
      mobile: editingEmployee.mobile || "",
      designation: editingEmployee.designation || "",
      password: "",
      reporting_to: editingEmployee.reporting_to || "",
      hr: editingEmployee.HR || "", 
      aadhaar_no: editingEmployee.aadhaar_number || "",
      role: editingEmployee.role || "Employee",
      startDate: editingEmployee.start_date?.split("T")[0] || "",
      endDate: editingEmployee.end_date?.split("T")[0] || "",
      location: editingEmployee.location || ""
    });

    setIsCurrentlyWorking(!editingEmployee.end_date);
  }
}, [editingEmployee]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "mobile") {
      value = value.replace(/[^0-9+\-\s()]/g, "");
    }

    value = value.replace(/\s+/g, " ");

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submit = () => {
    if (!form.first_name?.trim()) {
      return onSave({ error: true, message: "First name is required" });
    }

    if (!form.last_name?.trim()) {
      return onSave({ error: true, message: "Last name is required" });
    }

    if (!form.email?.trim()) {
      return onSave({ error: true, message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return onSave({ error: true, message: "Enter a valid email address" });
    }

    if (!editingEmployee && !form.password?.trim()) {
      return onSave({ error: true, message: "Password is required" });
    }

    if (!form.mobile?.trim()) {
      return onSave({ error: true, message: "Mobile is required" });
    }

    if (form.mobile.length < 10) {
      return onSave({ error: true, message: "Enter valid mobile number" });
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      return onSave({ error: true, message: "Enter valid 10-digit mobile number" });
    }

    if (!form.designation?.trim()) {
      return onSave({ error: true, message: "Designation is required" });
    }

    if (!form.startDate) {
      return onSave({ error: true, message: "Start date is required" });
    }

    // if (!isCurrentlyWorking && !form.endDate) {
    //   return onSave({ error: true, message: "End date is required" });
    // }

    if (!form.reporting_to?.trim()) {
      return onSave({ error: true, message: "Reporting manager is required" });
    }

    if (!form.hr?.trim()) {
      return onSave({ error: true, message: "HR ID is required" });
    }

    if (!form.aadhaar_no?.trim()) {
      return onSave({ error: true, message: "Aadhaar is required" });
    }

    if (!/^\d{12}$/.test(form.aadhaar_no)) {
      return onSave({ error: true, message: "Aadhaar must be 12 digits" });
    }

    if (!form.role) {
      return onSave({ error: true, message: "Role is required" });
    }
    if (!form.location?.trim()) {
      return onSave({ error: true, message: "Location is required" });
    }

    console.log("FORM BEFORE SEND:", form);
    //onSave(form); 
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] mx-2">

        {/* HEADER */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {editingEmployee ? "Update Employee" : "Add New Employee"}
            </h2>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">

          {/*Name*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full mt-2 py-3 px-3 border border-gray-200 bg-gray-50 rounded-xl outline-none"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full mt-2 py-3 px-3 border border-gray-200 bg-gray-50 rounded-xl outline-none"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Aadhaar Number <span className="text-red-500">*</span>
            </label>

            <input
              name="aadhaar_no"
              value={form.aadhaar_no}
              onChange={handleChange}
              maxLength={12}
              className="w-full mt-2 py-3 px-3 border border-gray-200 bg-gray-50 rounded-xl outline-none"
              placeholder="Enter 12-digit Aadhaar"
            />
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
                placeholder="example@gmail.com"
                className="w-full py-3 outline-none text-sm"
              />
            </div>
          </div>

          {/* MOBILE + DESIGNATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                <FiPhone className="text-gray-400 mr-2" />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full py-3 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Designation <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                <FiBriefcase className="text-gray-400 mr-2" />
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="e.g. Developer"
                  className="w-full py-3 outline-none text-sm"
                />
              </div>
            </div>

          </div>

          {/*start date*/}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full mt-2 py-3 px-3 border border-gray-200 bg-gray-50 rounded-xl outline-none"
            />
          </div>
          {/*end date + currently working toggle*/}
          <div>
            <label className="text-sm font-medium text-gray-700">
              End Date {/*<span className="text-red-500">*</span> */}
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={isCurrentlyWorking}
                onChange={() => {
                  setIsCurrentlyWorking(!isCurrentlyWorking);
                  setForm({ ...form, endDate: "" });
                }}
              />
              <label className="text-sm text-gray-600">
                Currently Working
              </label>
            </div>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              disabled={isCurrentlyWorking}
              className="w-full mt-2 py-3 px-3 border border-gray-200 bg-gray-50 rounded-xl outline-none"
            />
          </div>

          {/* REPORTING + HR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Reporting To */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reporting To (Employee ID) <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  name="reporting_to"
                  value={form.reporting_to}
                  onChange={handleChange}
                  placeholder="e.g. EMP-1001"
                  className="w-full py-3 outline-none text-sm"
                />
              </div>
            </div>

            {/* HR Employee ID */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                HR Employee ID <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  name="hr"
                  value={form.hr}
                  onChange={handleChange}
                  placeholder="e.g. MSS001"
                  className="w-full py-3 outline-none text-sm"
                />
              </div>
            </div>

          </div>

          {/*Password*/}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
              
              <FiLock className="text-gray-400 mr-2" />

              <input
                type={showPassword ? "text" : "password"} //toggle
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full py-3 outline-none text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 ml-2"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

            </div>
          </div>

          {/* ROLE DROPDOWN */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>

            <div
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3 py-3 cursor-pointer"
            >
              <span className="text-sm text-gray-700">{form.role}</span>
              <FiChevronDown
                className={`transition ${showRoleDropdown ? "rotate-180" : ""}`}
              />
            </div>

            {showRoleDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow">
                {["Employee", "Admin", "User"].map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setForm({ ...form, role: r });
                      setShowRoleDropdown(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl mt-2 px-3">
              <FiMapPin className="text-gray-400 mr-2" />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
          >
            {editingEmployee ? "Update" : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddEmployee;