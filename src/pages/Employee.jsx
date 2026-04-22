import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
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
        const res = await API.get("/admin/users");
        console.log("feached employee data:",res.data);
        setEmployees(res.data);
    } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /*add or update*/
  const handleSave = async (form) => {
    try {
      const payload = {
        first_name: form.Name,
        email: form.email,
        mobile: form.mobile,
        designation: form.designation,
        password: form.password,
        reporting_to: form.reporting_to,      
        hr_employee_id: form.hr_employee_id,  
        role: form.role,
      };

      console.log("Payloads sending are:",payload);

      if (editingEmployee) {
        const employee_id = editingEmployee.employee_id;
        const res = await API.put(`/admin/users/${employee_id}`, payload);
        console.log("Updated employee:",res.data);
        setPopup({
          show: true,
          message: "Employee updated successfully.",
          type: "success"
        });
      } 
      else {
        const res = await API.post("/admin/users", payload);
        console.log("Created employee:",res.data);
        setPopup({
          show: true,
          message: "Employee added successfully.",
          type: "success"
        });
      }

      await fetchEmployees();

      setShowModal(false);
      setEditingEmployee(null);

    }
    catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      console.log("ERROR FULL:", err.response?.data);
      setPopup({
        show: true,
        message: "Failed to save employee.",
        type: "error"
      });
    }
  };

  /*Delete*/
  const handleDelete = async (employee_id) => {
    setPopup({
      show: true,
      message: "Are you sure you want to delete this employee?",
      type: "confirm",
      onConfirm: async () =>{
        try {
          const res = await API.delete(`/admin/users/${employee_id}`);
          console.log("Deleting Employee:", res.data);
          const response = await fetchEmployees();
          console.log("Featch employee after deletion:", response.data);
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

  const handleEdit = async (employee_id) => {
    try {
      const res = await API.get(`/admin/users/${employee_id}`);
      setEditingEmployee(res.data);
      setShowModal(true);
    } catch (err) {
        console.error("Edit fetch error:", err.response?.data || err.message);
    }
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
            <tr>
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
              <tr key={emp.employee_id ||emp.email || index}
                onClick={() => navigate(`/employee-progile/${emp.employee_id}`)}
                className="hover:bg-gray-50 border-t border-gray-200 cursor-pointer">
                <td className="p-4">{emp.employee_id}</td>
                <td className="p-4">{emp.name}</td>
                <td className="p-4">{emp.mobile}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.reporting_to || "-"}</td>


                <td className="p-4 flex gap-3">
                  <FiEdit
                    onClick={() => {
                      handleEdit(emp.employee_id);
                      setShowModal(true);
                    }}
                    className="cursor-pointer hover:text-green-600"
                  />
                  <FiTrash2
                    onClick={() => handleDelete(emp.employee_id)}
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
                    onClick={() => {
                      popup.onConfirm();
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