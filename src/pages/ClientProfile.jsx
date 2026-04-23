import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiDownload, FiEye, FiEdit, FiTrash2, FiUpload, FiX, FiPenTool, FiLink } from "react-icons/fi";
import AddClient from "./AddClient";

const BASE_URL = "https://timesheet-api-790373899641.asia-south1.run.app";

function ClientProfile() {
  const { client_id } = useParams();
  const [client, setClient] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [links, setLinks] = useState([]);
  const [previewURL, setPreviewURL] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "", // success | error | confirm
    onConfirm: null
  });
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

  /*fetch link*/
  const fetchLinks = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/clients/clients/${client_id}/source-links`,
        getAuthHeaders()
      );
      console.log("Links API Response:", res.data);

      setLinks(res.data.source_links || []);

    } catch (err) {
      console.error("Error fetching links:", err);
    }
  };

  useEffect(() => {
    if (client_id) {
      fetchLinks();
    }
  }, [client_id]);

  const fetchProfilePhoto = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/clients/clients/${client_id}/photo`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const url = URL.createObjectURL(res.data);
      setProfilePreview(url);

    } catch (err) {
      console.log("No profile photo");
    }
  };

  useEffect(() => {
  if (client_id) {
    fetchProfilePhoto(); // ✅ ADD THIS
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

  /*upload document*/
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      return setPopup({
        show: true,
        message: "Please select a file",
        type: "error"
      });
    }

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("client_id", client_id);

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post(
        `${BASE_URL}/clients/clients/${client_id}/upload-documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setPopup({
        show: true,
        message: "Document uploaded successfully",
        type: "success"
      });
      setShowDocModal(false);
      setSelectedFile(null);
      setPreviewURL("");
      fetchClient();

    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setPopup({
        show: true,
        message:
          err.response?.data?.detail?.[0]?.msg ||
          err.response?.data?.detail?.[0] ||
          "Upload failed",
        type: "error"
      });
    }
  };


  /*view document*/
  const handleView = async (doc) => {
    try {
      const fileName =
      typeof doc === "string"
        ? doc.split("/").pop()
        : doc.file_name || doc.name;

      console.log("VIEW FILE:", fileName);

      const res = await axios.get(
        `${BASE_URL}/clients/clients/documents/${fileName}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const contentType = res.headers["content-type"];
      const file = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } catch (err) {
      console.error("View error:", err.response?.data || err.message);
      setPopup({
        show: true,
        message: "File not found",
        type: "error"
      });
    }
  };

  /*download document*/
  const handleDownload = async (doc) => {
    try {
      const fileName =
        typeof doc === "string"
          ? doc.split("/").pop()
          : doc.file_name || doc.name;

    console.log("DOWNLOAD FILE:", fileName);

      const res = await axios.get(
        `${BASE_URL}/clients/clients/documents/${fileName}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Download error:", err.response?.data || err.message);
      setPopup({
        show: true,
        message: "Download failed",
        type: "error"
      });
    }
  };

  const handleDelete = (doc) => {
    setPopup({
      show: true,
      message: "Are you sure you want to delete this document?",
      type: "confirm",
      onConfirm: async () => {
        try {
          const fileName =
            typeof doc === "string"
              ? doc.split("/").pop()
              : doc.file_name || doc.name;

          await axios.delete(
            `${BASE_URL}/clients/clients/${client_id}/delete-document-by-name`,
            {
              params: {
                filename: fileName
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

          setPopup({
            show: true,
            message: "Document deleted successfully",
            type: "success"
          });

          fetchClient();

        } catch (err) {
          console.error(err.response?.data);

          setPopup({
            show: true,
            message:
              err.response?.data?.detail?.[0]?.msg ||
              "Delete failed",
            type: "error"
          });
        }
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["pdf", "png", "jpg", "jpeg", "doc", "docx"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(ext)) {
      setPopup({
        show: true,
        message: "Invalid file type",
        type: "error"
      });
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image")) {
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setPreviewURL("");
    }
  };

  /*Add link*/
  const handleAddLink = async () => {
    if (!linkName || !linkURL) {
      return setPopup({
        show: true,
        message: "Please enter link name and URL",
        type: "error"
      });
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/clients/clients/${client_id}/add-source-links`,
        {
          links: [
            {
              link: linkURL,
              link_type: linkName
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("added link:", res.data);

      setPopup({
        show: true,
        message: "Link added successfully",
        type: "success"
      });

      setShowLinkModal(false);
      setLinkName("");
      setLinkURL("");
      fetchLinks();

    } catch (err) {
      console.error("FULL ERROR:", err.response?.data);

      setPopup({
        show: true,
        message:
          err.response?.data?.detail?.[0]?.msg ||
          "Failed to add link",
        type: "error"
      });
    }
  };

  /*delete link*/
  const handleDeleteLink = async (linkUrl) => {
    try {
      await axios.delete(
        `${BASE_URL}/clients/clients/${client_id}/delete-source-link`,
        {
          ...getAuthHeaders(),
          params: {
            link: linkUrl   //MUST be in params
          }
        }
      );

      setPopup({
        show: true,
        message: "Link deleted successfully",
        type: "success"
      });

      fetchLinks();

    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data);

      setPopup({
        show: true,
        message: "Failed to delete link",
        type: "error"
      });
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  /*add or update profile photo*/
  const handleUploadProfile = async () => {
    if (!profileFile) {
      return setPopup({
        show: true,
        message: "Please select an image",
        type: "error"
      });
    }

    try {
      const formData = new FormData();
      formData.append("photo", profileFile);

      const url = `${BASE_URL}/clients/clients/${client_id}/upload-photo`;

      const res = await axios({
          method: "put",
          url,
          data: formData, 
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Profile photo uploaded/updated", res.data);

      setPopup({
        show: true,
        message: "Profile photo saved successfully",
        type: "success"
      });

      setProfileFile(null);
      setProfilePreview("");
      fetchProfilePhoto();
      setShowPhotoModal(false);

    } catch (err) {
      console.error(err.response?.data);
      setPopup({
        show: true,
        message:
          err.response?.data?.detail?.[0]?.msg ||
          "Failed to upload photo",
        type: "error"
      });
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/clients/clients/${client_id}/delete-photo`,
        getAuthHeaders()
      );
      console.log("Delete photo response:", res.data);

      setPopup({
        show: true,
        message: "Profile photo deleted",
        type: "success"
      });

      fetchProfilePhoto();
      setShowPhotoModal(false);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        message: "Failed to delete profile photo",
        type: "error"
      });
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                profilePreview ||
                (client.photo
                  ? `${BASE_URL}/${client.photo}`
                  : "https://via.placeholder.com/100")
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover shadow"
            />
            {/* CONDITIONAL ICON */}
            <button
              onClick={() => setShowPhotoModal(true)}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer"
            >
              {client.photo ? <FiEdit /> : <FiUpload />}
            </button>
          </div>

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
            onClick={() => setShowDocModal(true)}
            className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <FiUpload />
            Upload
          </button>
        </div>

        {/* LIST */}
        {client.documents?.length ? (
          client.documents.map((doc, i) => {
            const fileName =
              typeof doc === "string"
                ? doc.split("/").pop()
                : doc.file_name || doc.name || "document";

            const fileType = fileName.split(".").pop().toUpperCase();

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
                      {fileType} • {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString()
                        : "Recently added"}
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
              onClick={() => setShowLinkModal(true)}
              className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              <FiLink />
              Add Link
            </button>
          </div>

          {/* LIST */}
          {links?.length ? (
            links.map((link, i) => {

              let name = link.link_type || "Untitled";
              let url = link.link || "#";

              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {name}
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-green-700 underline"
                    >
                      {url}
                    </a>
                  </div>

                  <div className="flex items-center gap-4 text-gray-500">
                    <FiTrash2
                      className="cursor-pointer hover:text-green-700"
                      onClick={() => handleDeleteLink(link.link)}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-6 text-gray-400">No links available</p>
          )}

        </div>
      </div>

      {showDocModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-100 rounded-2xl shadow-xl p-6 relative">

            <h2 className="text-xl font-semibold mb-4">
              Upload Document
            </h2>

            {/* DROP AREA */}
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />

              <label htmlFor="fileUpload" className="cursor-pointer">
                <p className="text-gray-500">
                  Click to upload or drag file
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, JPG, PNG, JPEG supported
                </p>
              </label>
            </div>

            {/* PREVIEW */}
            {selectedFile && (
              <div className="mt-4">
                <p className="text-sm font-medium">{selectedFile.name}</p>

                {previewURL && (
                  <img
                    src={previewURL}
                    alt="preview"
                    className="w-20 h-20 mt-2 rounded object-cover"
                  />
                )}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUploadDocument}
                className="px-4 py-2 bg-green-800 text-white rounded-lg"
              >
                Upload
              </button>
            </div>

          </div>
        </div>
      )}

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-96 rounded-2xl shadow-xl p-6 relative">

            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-3">
              Add Link
            </h2>

            {/* INPUTS */}
            <label className="text-sm font-semibold mb-1 px-2 block">
              Link Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter link name"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-2xl mb-3 hover:border-gray-200"
            />

            <label className="text-sm font-semibold mb-1 px-2 block">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter URL"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-2xl hover:border-gray-200"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-2xl hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-green-800 text-white rounded-2xl hover:bg-green-700"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}

      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Upload Profile Photo
            </h2>

            {/* CLICK AREA */}
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                id="profileUpload"
                className="hidden"
                onChange={handleProfileChange}
              />

              <label htmlFor="profileUpload" className="cursor-pointer">
                <p className="text-gray-500">Click here to add photo</p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, JPEG supported
                </p>
              </label>
            </div>

            {/* PREVIEW */}
            {profilePreview && (
              <img
                src={profilePreview}
                alt="preview"
                className="w-24 h-24 rounded-full mx-auto mt-4 object-cover"
              />
            )}

            {/* ACTIONS */}
            <div className="flex justify-between mt-6">

              {/* DELETE BUTTON */}
              {client.photo && (
                <button
                  onClick={handleDeleteProfile}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUploadProfile}
                  className="px-4 py-2 bg-green-800 text-white rounded-lg"
                >
                  Upload
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {showEdit && (
        <AddClient
          editingClient={client}   // ✅ important
          onClose={() => setShowEdit(false)}
          onAdd={handleUpdate}     // ✅ reuse submit
          setPopup={() => {}}
        />
      )}

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-40 z-50 px-2">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <p className={`text-lg font-semibold mb-4
                ${popup.type === "success" && "text-green-600"}
                ${popup.type === "error" && "text-red-600"}
                ${popup.type === "confirm" && "text-gray-800"}
            `}>
             {popup.message}
            </p>
                  {/* BUTTONS */}
                    <div className="flex justify-center gap-3">
                      {popup.type === "confirm" ? (
                        <>
                          <button
                            onClick={async () => {
                              await popup.onConfirm();
                            }}
                              className="px-4 py-2 bg-red-600 text-white rounded"
                          >
                              Yes
                          </button>

                          <button
                            onClick={() => setPopup({ show: false })}
                            className="px-4 py-2 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                  <button
                    onClick={() => setPopup({ show: false })}
                    className="px-4 py-2 bg-green-800 text-white rounded-2xl hover:bg-green-700"
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

export default ClientProfile;