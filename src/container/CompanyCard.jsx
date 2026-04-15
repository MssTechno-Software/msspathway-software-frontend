import { FiEdit, FiTrash } from "react-icons/fi";

function CompanyCard({ data, onEdit, onDelete }) {
    const stages = ["Call", "Mail", "L1", "L2", "Offer"];

    const stageLabels = {
        Call: "CALL",
        Mail: "MAIL",
        L1: "L1 STAGE",
        L2: "L2 STAGE",
        Offer: "OFFER LETTER"
    };

    const stageData = data?.stages || [];

    const latestStage =
        stageData.length > 0 ? stageData[stageData.length - 1] : null;

    const getStatusColor = (status) => {
        if (status === "Cleared") return "bg-green-100 text-green-700";
        if (status === "Pending") return "bg-yellow-100 text-yellow-700";
        if (status === "Rejected") return "bg-red-100 text-red-700";
        if (status === "Skipped") return "bg-gray-100 text-gray-500";
        return "bg-gray-100 text-gray-500";
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h3 className="font-semibold text-2xl text-black">
                        {data?.company || "No Company"}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                        Updated {latestStage?.date || "N/A"}
                    </p>
                </div>

                <div className="flex gap-4 text-gray-500 text-lg">
                    <FiEdit
                        onClick={onEdit}
                        className="cursor-pointer hover:text-green-700 transition"
                    />

                    <FiTrash
                        onClick={onDelete}
                        className="cursor-pointer hover:text-red-600 transition"
                    />
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="flex gap-3 mb-6 mt-4">
                {(() => {
                    const STAGES = ["Call", "Mail", "L1", "L2", "Offer"];
                    const stageMap = {};

                    stageData.forEach((item) => {
                        stageMap[item.stage] = item;
                    });

                    const latestStage = stageData[stageData.length - 1];
                    const latestIndex = STAGES.indexOf(latestStage?.stage);

                    return STAGES.map((stage, index) => {
                        const item = stageMap[stage];
                        let color = "bg-gray-200";

                        // Previous stages = green
                        if (index < latestIndex) {
                            color = "bg-green-500";
                        }

                        // Current stage = actual status
                        if (item) {
                            if (item.status === "Rejected") color = "bg-red-500";
                            else if (item.status === "Pending") color = "bg-yellow-500";
                            else if (item.status === "Cleared") color = "bg-green-500";
                            else if (item.status === "Skipped") color = "bg-gray-400";
                        }

                        return (
                            <div
                                key={stage}
                                className={`h-2 flex-1 rounded-full ${color}`}
                            />
                        );
                    });
                })()}
            </div>

            {/* STAGE DETAILS */}
            <div className="grid grid-cols-5 gap-3 text-xs text-gray-500 mt-2">
                {stages.map((stage) => {
                    const item = stageData.find((s) => s.stage === stage);

                    return (
                        <div key={stage}>
                            <p className="uppercase text-xs font-medium tracking-wide">
                                {stageLabels[stage]}
                            </p>

                            <p className="text-[11px] text-gray-400 mt-1">
                                {item?.date || (
                                    stages.indexOf(stage) < stages.indexOf(latestStage?.stage)
                                        ? latestStage?.date
                                        : "-"
                                )}
                            </p>

                            {item?.status && (stage === "L1" || stage === "L2") && (
                                <span
                                    className={`text-[10px] px-2 py-1 rounded-full mt-2 inline-block font-medium ${getStatusColor(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CompanyCard;