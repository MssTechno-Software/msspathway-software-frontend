import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import AddEmployee from "./AddEmployee";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
    baseURL: "https://timesheet-api-790373899641.asia-south1.run.app",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
    onConfirm: null
  });
  const navigate = useNavigate();

  const rowsPerPage = 5;

  /*fetch api*/
  const fetchEmployees = async () => {
    try {
        const res = await API.get("/admin/users-table");
        console.log("feached employee data:",res.data);
        setEmployees(res.data.data || res.data);
    } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /*add or update*/
  const handleSave = async (form) => {
    if (form.error) {
      setPopup({
        show: true,
        message: form.message,
        type: "error"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password || "");
      formData.append("role", form.role.toLowerCase());
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("mobile", form.mobile);
      formData.append("designation", form.designation);
      formData.append("reporting_to", form.reporting_to);
      formData.append("HR", form.hr);
      formData.append("aadhaar_number", form.aadhaar_no);
      formData.append("start_date", form.startDate);
      if (form.endDate) {
        formData.append("end_date", form.endDate);
      } else {
        formData.append("end_date", "currently working");
      }

      formData.append("location", form.location);

      for (let [k, v] of formData.entries()) {
        console.log(k, v);
      }

      if (editingEmployee) {
        /*update*/
        console.log("Updating Employee with data:", Object.fromEntries(formData.entries()));
        const res = await API.put(`/admin/users/${editingEmployee.employee_id}`, formData);
        console.log("Updating Employee:", res.data);
        setPopup({ 
          show: true, 
          message: "Employee updated successfully.", 
          type: "success" 
        });
      } else {
        console.log("Adding Employee with data:", Object.fromEntries(formData.entries()));
        const res = await API.post("/admin/users", formData);
        console.log("Adding Employee:", res.data);
        setPopup({ 
          show: true, 
          message: "Employee added successfully.", 
          type: "success" 
        });
      }

      fetchEmployees();
      setShowModal(false);
      setEditingEmployee(null);

    } catch (err) {
      console.error("ERROR:", err.response?.data);
      setPopup({
        show: true,
        message: err.response?.data?.detail || "Failed to save employee",
        type: "error"
      });
    }
  };

  /*Delete*/
  const handleDelete = async (employee_id) => {
    console.log("Attempting to delete employee with ID:", employee_id);
    setPopup({
      show: true,
      message: "Are you sure you want to delete this employee?",
      type: "confirm",
      onConfirm: async () =>{
        try {
          const res = await API.delete(`/admin/users/${employee_id}`);
          console.log("Deleting Employee:", res.data);
          fetchEmployees();
          setPopup({
            show: true,
            message: "Employee deleted successfully.",
            type: "success"
          });
        }
        catch (err) {
          console.error("Delete error:", err.response?.data || err.message);
            setPopup({
            show: true,
            message: "Failed to delete employee.",
            type: "error"
          });
        }
      }
    });
  };

  // const handleEdit = async (employee_id) => {
  //   try {
  //     const res = await API.get(`/admin/users/${employee_id}`);
  //     setEditingEmployee(res.data);
  //     setShowModal(true);
  //   } catch (err) {
  //       console.error("Edit fetch error:", err.response?.data || err.message);
  //   }
  // };
  const handleEdit = (emp) => {
    console.log("Editing employee:", emp);

    setEditingEmployee(emp);
    setShowModal(true);
  };

  // FILTER
  const filteredEmployees = employees.filter((emp) =>
    emp.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email?.toLowerCase().includes(search.toLowerCase()) ||
    emp.mobile?.includes(search)
  );

  // PAGINATION
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="p-6">

      {/* SEARCH */}
      <div className="w-full sm:w-1/2 mb-4">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
          <FiSearch className="mr-2 text-gray-400" />
          <input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
          {search && <FiX onClick={() => setSearch("")} />}
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-gray-500">Manage corporate personnel records</p>
        </div>

        <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-800 text-white px-4 rounded-xl shadow hover:bg-green-700"
        >
                Add New Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-md">
          <thead className="bg-gray-100 text-gray-600">
            <tr className="border-b border-gray-200">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">REPORTING TO</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentEmployees.map((emp) => (
              <tr key={emp.employee_id ||emp.email}
               onClick={() => navigate(`/dashboard/employees/${emp.employee_id}`)} 
                className="hover:bg-gray-50 border-t border-gray-200 cursor-pointer">
                <td className="p-4">{emp.employee_id}</td>
                <td className="p-4">{emp.name}</td>
                <td className="p-4">{emp.mobile}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.reporting_to}</td>


                <td className="p-4 flex gap-3">
                  <FiEdit
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(emp);
                    }}
                    className="cursor-pointer hover:text-green-600"
                  />
                  <FiTrash2
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp.employee_id);
                    }}
                    className="cursor-pointer  hover:text-green-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between p-4 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {currentEmployees.length} of {filteredEmployees.length}
          </p>

          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p-1,1))}>
              Prev
            </button>
            <button className="bg-green-800 text-white px-3 rounded">
              {currentPage}
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <AddEmployee
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          onSave={handleSave}
          editingEmployee={editingEmployee}
        />
      )}

      {/*popup*/}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-2">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">

            <p className={`mb-4 font-semibold
              ${popup.type === "success" && "text-green-600"}
              ${popup.type === "error" && "text-red-600"}
              ${popup.type === "confirm" && "text-gray-800"}
            `}>
              {popup.message}
            </p>

            <div className="flex justify-center gap-3">
              {popup.type === "confirm" ? (
                <>
                  <button
                    onClick={async () => {
                      await popup.onConfirm();
                      setPopup({ show: false });
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Yes
                  </button>

                  <button
                    onClick={() => setPopup({ show: false })}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setPopup({ show: false })}
                  className="bg-green-800 text-white px-4 py-2 rounded"
                >
                  OK
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;