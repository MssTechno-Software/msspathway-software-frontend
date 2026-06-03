import {
  FiBriefcase,
  FiTrendingUp,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

function ClientOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#301E0F]">
          Welcome back, Revanth
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Practice. Analyze. Improve. Repeat.......
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        {/* TOTAL INTERVIEWS */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 flex items-center gap-6">
          <div className="bg-green-100 p-5 rounded-2xl">
            <FiBriefcase className="text-green-800 text-4xl" />
          </div>

          <div>
            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              Total Interviews Completed
            </p>

            <h2 className="text-6xl font-light text-[#301E0F] mt-2">
              154
            </h2>

            <p className="text-green-700 mt-2">
              Keep up the good work! 💚
            </p>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="bg-white rounded-2xl shadow-sm border-l-4 border-green-700 p-8 flex items-center gap-6">
          <div className="bg-green-100 p-5 rounded-2xl">
            <FiTrendingUp className="text-green-800 text-4xl" />
          </div>

          <div>
            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              Average Performance Score
            </p>

            <h2 className="text-6xl font-light text-green-700 mt-2">
              78%
            </h2>

            <p className="text-green-700 mt-2">
              You're performing great! ✨
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT INTERVIEWS */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center gap-4 px-6 py-5 border-b">
            <div className="bg-green-100 p-3 rounded-xl">
              <FiFileText className="text-green-800 text-2xl" />
            </div>

            <h2 className="text-2xl font-semibold text-[#301E0F]">
              Recently Completed Interviews
            </h2>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="text-left text-gray-400 uppercase tracking-widest text-sm border-b">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Insights</th>
                </tr>
              </thead>

              <tbody>

                {[
                  {
                    date: "Oct 24, 2023",
                    mode: "Code Interview",
                    score: "85/100",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    date: "Oct 23, 2023",
                    mode: "Self-Introduction",
                    score: "92/100",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    date: "Oct 22, 2023",
                    mode: "Resume-Based",
                    score: "64/100",
                    color: "bg-red-100 text-red-700",
                  },
                  {
                    date: "Oct 21, 2023",
                    mode: "Topic-Specific Theory",
                    score: "78/100",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    date: "Oct 20, 2023",
                    mode: "Company-Specific",
                    score: "81/100",
                    color: "bg-green-100 text-green-700",
                  },
                ].map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-5 font-medium text-[#301E0F]">
                      {item.date}
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {item.mode}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-md text-sm font-medium ${item.color}`}
                      >
                        {item.score}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button className="text-green-800 font-medium hover:underline">
                        View Insights ↗
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* PERFORMANCE ANALYTICS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <div className="flex items-center gap-4 mb-8">
            <div className="bg-green-100 p-3 rounded-xl">
              <FiBarChart2 className="text-green-800 text-2xl" />
            </div>

            <h2 className="text-2xl font-semibold text-[#301E0F]">
              Performance Analytics
            </h2>
          </div>

          {[
            { label: "Technical Theory", value: 82 },
            { label: "Code Interview", value: 74 },
            { label: "Self-Introduction", value: 89 },
            { label: "Resume-Based", value: 68 },
            { label: "Company-Specific", value: 71 },
          ].map((item, index) => (
            <div key={index} className="mb-7">

              <div className="flex justify-between mb-2">
                <span className="text-sm uppercase tracking-wider text-gray-500">
                  {item.label}
                </span>

                <span className="font-semibold text-[#301E0F]">
                  {item.value}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-800 h-3 rounded-full"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientOverviewPage;