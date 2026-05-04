import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiFilter, FiPhone, FiMail, FiUser, FiAward } from "react-icons/fi";
import axios from "axios";

const API = axios.create({
  baseURL: "https://timesheet-api-790373899641.asia-south1.run.app",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Overview() {
  const { client_id } = useParams();
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  // FETCH APPLICATIONS

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/applications/applications/${client_id}`);
        const appsObject = res.data?.applications || {};

        const allApps = Object.entries(appsObject).flatMap(([platform, apps]) =>
          apps.map(app => ({ ...app, platform }))
        );

        setApplications(allApps);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    fetchApplications();
  }, [client_id]);

  // FETCH REPORTS
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get(`/reports/clients/${client_id}/reports`);
        const data = res.data?.company_progression || [];
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports", err);
      }
    };

    fetchReports();
  }, [client_id]);

  const filteredApplications = applications.filter((app) => {
    if (!appliedFromDate && !appliedToDate) return true;

    const appDate = new Date(app.date);

    const from = appliedFromDate ? new Date(appliedFromDate) : null;
    const to = appliedToDate ? new Date(appliedToDate) : null;

    return (!from || appDate >= from) && (!to || appDate <= to);
  });

  const filteredReports = reports.filter((r) => {
    if (!appliedFromDate && !appliedToDate) return true;

    const date = new Date(r.updated_at || r.date);

    const from = appliedFromDate ? new Date(appliedFromDate) : null;
    const to = appliedToDate ? new Date(appliedToDate) : null;

    return (!from || date >= from) && (!to || date <= to);
  });

  //APPLICATION PLATFORM COUNTS
  const platforms = ["Naukri", "LinkedIn", "Career Pages", "Cold Emails", "Other"];

  const platformCounts = platforms.map((platform) => ({
    name: platform,
    value: filteredApplications.filter(a => a.platform === platform).length
  }));

  const max = Math.max(...platformCounts.map(p => p.value), 1);

  // FUNNEL LOGIC
  const STAGES = ["Call", "Mail", "L1", "L2", "Offer"];

  const normalizeStage = (stage) => {
    const value = stage?.toLowerCase() || "";

    if (value.includes("call")) return "Call";
    if (value.includes("mail")) return "Mail";
    if (value.includes("l1")) return "L1";
    if (value.includes("l2")) return "L2";
    if (value.includes("offer")) return "Offer";

    return null;
  };

  const getStageCount = (stage) => {
    return filteredReports.filter((r) => {
      const normalized = normalizeStage(r.current_stage);
      if (!normalized) return false;

      const currentIndex = STAGES.indexOf(normalized);
      const targetIndex = STAGES.indexOf(stage);

      return currentIndex >= targetIndex; // keeps previous stages
    }).length;
  };

  // PERCENTAGE FUNCTION
  const getPercentage = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round((current / previous) * 100);
  };

  // FUNNEL DATA
  const callCount = getStageCount("Call");
  const mailCount = getStageCount("Mail");
  const l1Count = getStageCount("L1");
  const l2Count = getStageCount("L2");
  const offerCount = getStageCount("Offer");

  const funnel = [
    {
      title: "Calls Received",
      value: callCount,
      percent: 100,
      subtitle: "Initial Screening",
      icon: <FiPhone />,
    },
    {
      title: "Mails Received",
      value: mailCount,
      percent: getPercentage(mailCount, callCount),
      subtitle: "Documentation",
      icon: <FiMail />,
    },
    {
      title: "L1 Interviews",
      value: l1Count,
      percent: getPercentage(l1Count, mailCount),
      subtitle: "Technical Round",
      icon: <FiUser />,
    },
    {
      title: "L2 Interviews",
      value: l2Count,
      percent: getPercentage(l2Count, l1Count),
      subtitle: "Cultural Fit",
      icon: <FiUser />,
    },
    {
      title: "Offer Letters",
      value: offerCount,
      percent: getPercentage(offerCount, l2Count),
      subtitle: "Final Selection",
      icon: <FiAward />,
      highlight: true,
    },
  ];

  return (
    <div className="p-6 bg-[#f5f6f8] min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          Executive Overview
        </h1>

        {/* FILTER */}
        <div className="flex flex-wrap items-center gap-3">

          {/* FROM */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-sm outline-none"
            />
          </div>

          {/* TO */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-sm outline-none"
            />
          </div>

          {/* APPLY */}
          <button
            onClick={() => {
              setAppliedFromDate(fromDate);
              setAppliedToDate(toDate);
            }}
            className="bg-green-800 text-white px-4 py-1 rounded-lg text-sm cursor-pointer"
          >
            Search
          </button>

          {/* CLEAR */}
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setAppliedFromDate("");
              setAppliedToDate("");
            }}
            className="text-gray-600 text-sm px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer"
          >
            Clear
          </button>

        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">

        {/*LEFT CARD*/}
        <div className="col-span-3 bg-gray-100 p-6 rounded-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                Applications by Platform
              </h2>
            </div>
          </div>

          {platformCounts.map((item, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between text-md mb-1 font-bold">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>

              <div className="w-full h-2 bg-[#e2cbb8] rounded-full">
                <div
                  className="h-2 bg-[#3b6b4f] rounded-full"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT CARD (PREMIUM) */}
        <div className="col-span-2 relative rounded-3xl p-6 text-white 
            bg-linear-to-br from-[#3a2418] to-[#2b1a12] 
            shadow-2xl overflow-hidden">

          {/* dots background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [bg-size:16px_16px]"></div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white">
              Recruitment Reports
            </h2>

            <div className="space-y-4 pt-3">
              {funnel.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl flex justify-between items-center
                  ${item.highlight
                    ? "bg-linear-to-r from-green-800 to-green-700"
                    : "bg-white/5 backdrop-blur-md border border-white/10"
                  }`}
                >

                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-300">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-semibold">{item.value}</p>
                    <p className="text-xs text-gray-300">
                      {item.percent}% {i === 0 ? "Volume" : "Pass Rate"}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}