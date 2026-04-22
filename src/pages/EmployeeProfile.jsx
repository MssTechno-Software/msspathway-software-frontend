import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

function EmployeeProfile() {
  const { employee_id } = useParams();
  const [employee, setEmployee] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/users/${employee_id}`,
        getAuthHeaders()
      );
      setEmployee(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  if (!employee) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-[#f5f7f6] min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-green-800 text-white flex items-center justify-center rounded-xl text-2xl">
          {employee.first_name?.[0]}
        </div>

        <div>
          <h1 className="text-4xl font-bold">
            {employee.first_name}
          </h1>
          <p className="text-gray-500">
            {employee.designation}
          </p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-xs text-gray-400">EMAIL</p>
          <p className="font-semibold">{employee.email}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-xs text-gray-400">MOBILE</p>
          <p className="font-semibold">{employee.mobile}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-xs text-gray-400">ROLE</p>
          <p className="font-semibold">{employee.role}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-xs text-gray-400">REPORTING TO</p>
          <p className="font-semibold">
            {employee.reporting_to || "-"}
          </p>
        </div>

      </div>

    </div>
  );
}

export default EmployeeProfile;