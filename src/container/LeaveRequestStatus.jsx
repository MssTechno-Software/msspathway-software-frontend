import { FiX } from "react-icons/fi";

function LeaveRequestStatus({ open, onClose, selectedRequest, onApprove, onReject }) {
  if (!open || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-3xl bg-[#FCFAF8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1E130F]">
                Review Request
            </h2>
              
            <button
                onClick={onClose}
                className="text-xl leading-none text-[#7C7873] hover:text-black"
            >
                <FiX />
            </button>
          </div>

          <div className="mb-10 rounded-2xl bg-[#FBF2EC] px-8 py-8 text-center">
            <p className="mb-3 text-sm uppercase text-[#8D847D]">
              Selected Request
            </p>

            <h3 className="text-lg font-semibold text-[#1E130F]">
              {selectedRequest.employee_name || selectedRequest.name || "Employee"}
            </h3>

            <p className="mt-2 text-lg text-[#6E675F]">
              {selectedRequest.employee_id || selectedRequest.id || "ID"}
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => onApprove(selectedRequest)}
              className="w-full rounded-xl bg-green-800 py-5 text-xl font-semibold text-white shadow-lg hover:bg-green-700"
            >
              Approve
            </button>

            <button
              onClick={() => onReject(selectedRequest)}
              className="w-full rounded-xl border border-gray-300 bg-white py-5 text-xl font-semibold text-red-400 hover:bg-gray-100"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequestStatus;
