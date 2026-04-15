import axios from "axios";

const BASE_URL =
  "https://timesheet-api-790373899641.asia-south1.run.app/reports";

// Common auth config
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET reports
export const getReportsByClient = async (clientId) => {
  const res = await axios.get(
    `${BASE_URL}/clients/${clientId}/reports`,
    getAuthConfig()
  );
  return res.data;
};

// POST add report
export const addReport = async (clientId, payload) => {
  const res = await axios.post(
    `${BASE_URL}/clients/${clientId}/reports`,
    payload,
    getAuthConfig()
  );
  return res.data;
};

// PUT update report
export const updateReport = async (reportId, payload) => {
  const res = await axios.put(
    `${BASE_URL}/reports/${reportId}`,
    payload,
    getAuthConfig()
  );
  return res.data;
};

// DELETE report
export const deleteReport = async (reportId) => {
  const res = await axios.delete(
    `${BASE_URL}/reports/${reportId}`,
    getAuthConfig()
  );
  return res.data;
};