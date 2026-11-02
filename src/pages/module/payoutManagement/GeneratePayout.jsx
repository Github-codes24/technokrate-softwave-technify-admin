import { useState } from "react";
import UploadReferenceModal from "./UploadReferenceModal";
const GeneratePayout = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Generate Payout</h2>

      {/* Generate payout form */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md">
        <select className="w-full border rounded p-2">
          <option>Select Agent</option>
          <option>Rohit Sharma</option>
          <option>Ankit Verma</option>
        </select>

        <input
          type="number"
          placeholder="Payable Amount"
          className="w-full border rounded p-2"
        />

        <button className="w-full bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white py-2 rounded">
          Generate Payout
        </button>
      </div>

      {/* Upload Reference Button */}
      <button
        onClick={() => setOpenModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload Payment Reference
      </button>

      {/* MODAL */}
      {openModal && (
        <UploadReferenceModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default GeneratePayout;



