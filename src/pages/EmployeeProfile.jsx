// // import { useParams } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

// // function EmployeeProfile() {
// //   const { employee_id } = useParams();
// //   const [employee, setEmployee] = useState(null);

// //   const getAuthHeaders = () => {
// //     const token = localStorage.getItem("token");
// //     return {
// //       headers: {
// //         Authorization: token ? `Bearer ${token}` : "",
// //       },
// //     };
// //   };

// //   const fetchEmployee = async () => {
// //     try {
// //       const res = await axios.get(
// //         `${BASE_URL}/admin/users/${employee_id}`,
// //         getAuthHeaders()
// //       );
// //       setEmployee(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchEmployee();
// //   }, []);

// //   if (!employee) return <div className="p-6">Loading Employee...</div>;

// //   return (
// //     <div className="p-6 bg-[#f5f7f6] min-h-screen">

// //       {/* HEADER */}
// //       <div className="flex items-center gap-4">
// //         <div className="w-20 h-20 bg-green-800 text-white flex items-center justify-center rounded-xl text-2xl">
// //           {employee.first_name?.[0]}
// //         </div>

// //         <div>
// //           <h1 className="text-4xl font-bold">
// //             {employee.first_name}
// //           </h1>
// //           <p className="text-gray-500">
// //             {employee.designation}
// //           </p>
// //         </div>
// //       </div>

// //       {/* INFO CARDS */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

// //         <div className="bg-white p-4 rounded-xl shadow">
// //           <p className="text-xs text-gray-400">EMAIL</p>
// //           <p className="font-semibold">{employee.email}</p>
// //         </div>

// //         <div className="bg-white p-4 rounded-xl shadow">
// //           <p className="text-xs text-gray-400">MOBILE</p>
// //           <p className="font-semibold">{employee.mobile}</p>
// //         </div>

// //         <div className="bg-white p-4 rounded-xl shadow">
// //           <p className="text-xs text-gray-400">ROLE</p>
// //           <p className="font-semibold">{employee.role}</p>
// //         </div>

// //         <div className="bg-white p-4 rounded-xl shadow">
// //           <p className="text-xs text-gray-400">REPORTING TO</p>
// //           <p className="font-semibold">
// //             {employee.reporting_to || "-"}
// //           </p>
// //         </div>

// //       </div>

// //     </div>
// //   );
// // }

// // export default EmployeeProfile;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FiEye, FiDownload, FiUpload } from "react-icons/fi";

// const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

// function EmployeeProfile() {
//   const { employee_id } = useParams();

//   const [employee, setEmployee] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [showUpload, setShowUpload] = useState(false);
//   const [file, setFile] = useState(null);

//   const getAuthHeaders = () => ({
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   });

//   /* FETCH EMPLOYEE */
//   const fetchEmployee = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/admin/users/${employee_id}`,
//         getAuthHeaders()
//       );

//       setEmployee(res.data.data || res.data);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (employee_id) 
//       fetchEmployee();
//   }, [employee_id]);

//   /* VIEW FILE */
//   const handleView = async (fileName) => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/employees/documents/${fileName}`,
//         {
//           responseType: "blob",
//           ...getAuthHeaders()
//         }
//       );

//       const url = URL.createObjectURL(new Blob([res.data]));
//       window.open(url, "_blank");

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* DOWNLOAD FILE */
//   const handleDownload = async (fileName) => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/employees/documents/${fileName}`,
//         {
//           responseType: "blob",
//           ...getAuthHeaders()
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");

//       link.href = url;
//       link.download = fileName;
//       link.click();

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (!employee) return <div className="p-6">Loading Employee...</div>;

//   return (
//     <div className="p-6 bg-[#f5f7f6] min-h-screen">

//       {/* HEADER */}
//       <div className="flex justify-between items-start">

//         <div className="flex items-center gap-4">
//           <div className="w-24 h-24 bg-green-800 text-white flex items-center justify-center rounded-full text-3xl shadow">
//             {employee.first_name?.[0]}
//           </div>

//           <div>
//             <h1 className="text-4xl font-bold text-gray-800">
//               {employee.first_name}
//             </h1>
//             <p className="text-gray-500">{employee.designation}</p>
//           </div>
//         </div>

//         <button
//           onClick={() => setShowUpload(true)}
//           className="flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-lg shadow"
//         >
//           <FiUpload /> Upload
//         </button>
//       </div>

//       {/* INFO CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

//         <div className="bg-white p-4 rounded-xl shadow-sm">
//           <p className="text-xs text-gray-400">EMAIL</p>
//           <p className="font-semibold">{employee.email}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow-sm">
//           <p className="text-xs text-gray-400">MOBILE</p>
//           <p className="font-semibold">{employee.mobile}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow-sm">
//           <p className="text-xs text-gray-400">ROLE</p>
//           <p className="font-semibold">{employee.role}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow-sm">
//           <p className="text-xs text-gray-400">REPORTING TO</p>
//           <p className="font-semibold">{employee.reporting_to || "-"}</p>
//         </div>

//       </div>

//       {/* DOCUMENTS */}
//       <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">

//         {/* HEADER */}
//         <div className="p-6 bg-gray-100 flex justify-between">
//           <div>
//             <h2 className="text-lg font-semibold">
//               Employee Documents
//             </h2>
//             <p className="text-sm text-gray-400">
//               Uploaded employee files
//             </p>
//           </div>
//         </div>

//         {/* LIST */}
//         {documents.length ? (
//           documents.map((doc, i) => (
//             <div
//               key={i}
//               className="flex justify-between px-6 py-4 border-b hover:bg-gray-50"
//             >
//               <p>{doc}</p>

//               <div className="flex gap-4 text-gray-500">
//                 <FiEye onClick={() => handleView(doc)} className="cursor-pointer"/>
//                 <FiDownload onClick={() => handleDownload(doc)} className="cursor-pointer"/>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="p-6 text-gray-400">No documents available</p>
//         )}
//       </div>

//       {/* UPLOAD MODAL */}
//       {showUpload && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

//           <div className="bg-white p-6 rounded-xl w-96">

//             <h2 className="text-lg font-semibold mb-4">
//               Upload Document
//             </h2>

//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button onClick={() => setShowUpload(false)}>
//                 Cancel
//               </button>

//               <button className="bg-green-800 text-white px-4 py-2 rounded">
//                 Upload
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default EmployeeProfile;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiDownload,
  FiEye,
  FiUpload,
  FiEdit,
  FiTrash2
} from "react-icons/fi";

const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

function EmployeeProfile() {
  const { employee_id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
    onConfirm: null
  });

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  // ✅ FETCH EMPLOYEE
  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/users/${employee_id}`,
        getAuthHeaders()
      );

      const data = res.data?.data ?? res.data;
      setEmployee(data);
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (employee_id) fetchEmployee();
  }, [employee_id]);

  // ✅ VIEW
  const handleView = async (doc) => {
    try {
      const fileName =
        typeof doc === "string"
          ? doc.split("/").pop()
          : doc.file_name || doc.name;

      const res = await axios.get(
        `${BASE_URL}/employees/documents/${fileName}`,
        {
          responseType: "blob",
          ...getAuthHeaders()
        }
      );

      const url = URL.createObjectURL(new Blob([res.data]));
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DOWNLOAD
  const handleDownload = async (doc) => {
    try {
      const fileName =
        typeof doc === "string"
          ? doc.split("/").pop()
          : doc.file_name || doc.name;

      const res = await axios.get(
        `${BASE_URL}/employees/documents/${fileName}`,
        {
          responseType: "blob",
          ...getAuthHeaders()
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const handleDelete = (doc) => {
    setPopup({
      show: true,
      message: "Delete this document?",
      type: "confirm",
      onConfirm: async () => {
        try {
          const fileName =
            typeof doc === "string"
              ? doc.split("/").pop()
              : doc.file_name || doc.name;

          await axios.delete(
            `${BASE_URL}/employees/${employee_id}/delete-document`,
            {
              params: { filename: fileName },
              ...getAuthHeaders()
            }
          );

          fetchEmployee();
          setPopup({ show: false });
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  // ✅ UPLOAD
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post(
        `${BASE_URL}/employees/${employee_id}/upload-document`,
        formData,
        getAuthHeaders()
      );

      setShowDocModal(false);
      setSelectedFile(null);
      fetchEmployee();
    } catch (err) {
      console.error(err);
    }
  };

  if (!employee) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">

          <div className="w-36 h-36 bg-green-800 text-white flex items-center justify-center rounded-full text-4xl">
            {employee.first_name?.[0]}
          </div>

          <div>
            <h1 className="text-5xl font-bold">
              {[employee.first_name, employee.last_name].join(" ")}
            </h1>
            <p className="text-lg font-semibold mt-1">
              {employee.designation}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-green-800 text-white px-5 py-2 rounded-xl">
          <FiEdit /> Edit
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">EMAIL</p>
          <p className="font-semibold">{employee.email}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">MOBILE</p>
          <p className="font-semibold">{employee.mobile}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">ROLE</p>
          <p className="font-semibold">{employee.role}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">LOCATION</p>
          <p className="font-semibold">{employee.location}</p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 bg-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Document Repository
            </h2>
            <p className="text-sm text-gray-400">
              Employee documents
            </p>
          </div>

          <button
            onClick={() => setShowDocModal(true)}
            className="flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-lg"
          >
            <FiUpload /> Upload
          </button>
        </div>

        {documents.length ? (
          documents.map((doc, i) => {
            const fileName =
              typeof doc === "string"
                ? doc.split("/").pop()
                : doc.file_name || doc.name;

            return (
              <div
                key={i}
                className="flex justify-between px-6 py-4 border-b hover:bg-gray-50"
              >
                <p>{fileName}</p>

                <div className="flex gap-4">
                  <FiEye onClick={() => handleView(doc)} />
                  <FiDownload onClick={() => handleDownload(doc)} />
                  <FiTrash2 onClick={() => handleDelete(doc)} />
                </div>
              </div>
            );
          })
        ) : (
          <p className="p-6 text-gray-400">No documents</p>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Upload Document
            </h2>

            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowDocModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="bg-green-800 text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EmployeeProfile;