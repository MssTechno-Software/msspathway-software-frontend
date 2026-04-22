import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiDownload, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import AddClient from "./AddClient";

const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

function ClientProfile() {
  const { client_id } = useParams();
  const [client, setClient] = useState(null);
  const [showEdit, setShowEdit] = useState(false); 

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
        `${BASE_URL}/clients/client-profile/${client_id}`, // FIXED
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
      fetchClient();
    }
  }, [client_id]);

  if (!client) {
    return <div className="p-6">Loading client details...</div>;
  }

  /*update*/
  const handleUpdate = async (updatedData) => {
    try {
      await axios.put(
        `${BASE_URL}/clients/update/${client_id}`,
        updatedData,
        getAuthHeaders()
      );

      setShowEdit(false);
      fetchClient(); // refresh data
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /*view document*/
  const handleView = async (doc) => {
    try {
      const fileName = doc.file_name;   
      const filePath = doc.file_url;   

      if (!fileName || !filePath) {
        console.error("File data missing", doc);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/clients/documents/view/${fileName}`,
        {
          params: {
            file_path: filePath,
            responseType: "blob",
            ...getAuthHeaders(),
          }
        }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      window.open(fileURL, "_blank");

    } catch (err) {
      console.error("View error:", err.response?.data || err.message);
    }
  };

  /*download document*/
  const handleDownload = async (doc) => {
  try {
      const fileName = doc.file_name;
      const filePath = doc.file_url;

      if (!fileName || !filePath) {
        console.error("File data missing", doc);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/clients/documents/download/${fileName}`,
        {
          params: {
            file_path: filePath,
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
    <div className="p-6 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={
              client.photo
                ? `${BASE_URL}/${client.photo}`
                : client.profile_image
                ? `${BASE_URL}/${client.profile_image}`
                : client.image_url
                ? `${BASE_URL}/${client.image_url}`
                : "https://via.placeholder.com/100"
            }
            alt="profile"
            className="w-24 h-24 rounded-xl object-cover shadow"
          />

          <div>
            <h1 className="text-5xl font-bold text-gray-800">
              {client.client_name || "No Name"}
            </h1>
            <p className="text-lg font-bold mt-1">
              {client.professional_role || "No Role"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md"
        >
          <FiEdit />
          Update Client
        </button>
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
        <div className="p-6 bg-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Document Repository
            </h2>
            <p className="text-sm text-gray-400">
              Verified compliance documents and professional records
            </p>
          </div>
          <button
            onClick={() => console.log("Open Add Document Modal")}
            className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Add Document
          </button>
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
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
              >

                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">

                  {/* FILE ICON */}
                  <div className="w-10 h-10 bg-green-800 text-green-800 flex items-center justify-center rounded-lg">
                    📄
                  </div>

                  {/* FILE INFO */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {fileName}
                    </p>

                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      PDF • 0.8 MB • Updated recently
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

                  <FiTrash2
                    className="cursor-pointer hover:text-green-700"
                    onClick={() => handleDelete(doc)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="p-6 text-gray-400">No documents available</p>
        )}
      </div>

      <div>
        {/* LINKS TABLE */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="p-6 bg-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Important Links
              </h2>
              <p className="text-sm text-gray-400">
                External resources and client-related links
              </p>
            </div>

            {/* ADD LINK BUTTON */}
            <button
              onClick={() => console.log("Open Add Link Modal")}
              className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Add Link
            </button>
          </div>

          {/* LIST */}
          {client.links?.length ? (
            client.links.map((link, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50"
              >

                {/* LEFT */}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {link.name || "Untitled Link"}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-green-700 underline"
                  >
                    {link.url}
                  </a>
                </div>

                {/* RIGHT */}
                <div className="text-gray-400 text-sm">
                  🔗
                </div>

                <div className="flex items-center gap-4 text-gray-500">
                  <FiTrash2
                    className="cursor-pointer hover:text-green-700"
                    onClick={() => handleDelete(link)}
                  />
                </div>

              </div>
            ))
          ) : (
            <p className="p-6 text-gray-400">No links available</p>
          )}

        </div>
      </div>

      {showEdit && (
        <AddClient
          editingClient={client}   // ✅ important
          onClose={() => setShowEdit(false)}
          onAdd={handleUpdate}     // ✅ reuse submit
          setPopup={() => {}}
        />
      )}
    </div>
  );
}

export default ClientProfile;