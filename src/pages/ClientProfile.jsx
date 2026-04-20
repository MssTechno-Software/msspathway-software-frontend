import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiDownload, FiEye } from "react-icons/fi";

const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

function ClientProfile() {
  const { client_id } = useParams(); // ✅ matches route
  const [client, setClient] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  const fetchClient = async () => {
    try {
      console.log("Fetching client ID:", client_id);

      const res = await axios.get(
        `${BASE_URL}/clients/client-profile/${client_id}`, // ✅ FIXED
        getAuthHeaders()
      );

      console.log("CLIENT DATA:", res.data);
      setClient(res.data);

    } catch (err) {
      console.error("API ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (client_id) {
      fetchClient(); // ✅ safety
    }
  }, [client_id]);

  if (!client) {
    return <div className="p-6">Loading client details...</div>;
  }

  const handleView = async (doc) => {
    try {
      const filePath =
        typeof doc === "string"
          ? doc
          : doc.document_url || doc.file || doc.url;

      const res = await axios.get(
        `${BASE_URL}/clients/documents/view`,
        {
          params: {
            file_path: filePath, // ✅ CORRECT PARAM
          },
          responseType: "blob",
          ...getAuthHeaders(),
        }
      );

      const fileURL = window.URL.createObjectURL(res.data);
      window.open(fileURL);

    } catch (err) {
      console.error("View error:", err.response?.data || err.message);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const filePath =
        typeof doc === "string"
          ? doc
          : doc.document_url || doc.file || doc.url;

      const fileName =
        typeof doc === "string"
          ? doc.split("/").pop()
          : doc.name || "file.pdf";

      const res = await axios.get(
        `${BASE_URL}/clients/documents/download`,
        {
          params: {
            file_path: filePath, // ✅ CORRECT PARAM
          },
          responseType: "blob",
          ...getAuthHeaders(),
        }
      );

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Download error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 bg-[#f5f7f6] min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <img
          src={
            client.photo
              ? `${BASE_URL}/${client.photo}`
              : "https://via.placeholder.com/100"
          }
          alt="profile"
          className="w-16 h-16 rounded-xl object-cover shadow"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {client.client_name || "No Name"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {client.professional_role || "No Role"}
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">EMAIL</p>
          <p className="font-semibold">{client.email}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">MOBILE</p>
          <p className="font-semibold">{client.mobile}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">AADHAAR</p>
          <p className="font-semibold">{client.aadhaar_number}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">LOCATION</p>
          <p className="font-semibold">{client.location}</p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-6 bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Document Repository
          </h2>
          <p className="text-sm text-gray-400">
            Verified compliance documents and professional records
          </p>
        </div>

        {/* LIST */}
        {client.documents?.length ? (
          client.documents.map((doc, i) => {
            const filePath =
              typeof doc === "string"
                ? doc
                : doc.document_url || doc.file || doc.url;

            const fileName =
              typeof doc === "string"
                ? doc.split("/").pop()
                : doc.name || filePath?.split("/").pop();

            const fileUrl = `${BASE_URL}/${filePath}`;

            return (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 border-b last:border-none hover:bg-gray-50 transition"
              >

                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">

                  {/* FILE ICON */}
                  <div className="w-10 h-10 bg-green-100 text-green-700 flex items-center justify-center rounded-lg">
                    📄
                  </div>

                  {/* FILE INFO */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {fileName}
                    </p>

                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      PDF • 0.8 MB • Updated recently

                      {/* VERIFIED BADGE (optional) */}
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px]">
                        VERIFIED
                      </span>
                    </p>
                  </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4 text-gray-500">
                  <FiEye
                    className="cursor-pointer hover:text-green-700"
                    onClick={() => handleView(doc)}
                  />

                  <FiDownload
                    className="cursor-pointer hover:text-green-700"
                    onClick={() => handleDownload(doc)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="p-6 text-gray-400">No documents available</p>
        )}
      </div>
    </div>
  );
}

export default ClientProfile;