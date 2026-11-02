import { useNavigate } from "react-router-dom";

export default function UploadProof() {
  const navigate = useNavigate()
  return (
    <div className="mt-4 bg-gray-50 p-3 rounded">
      <p className="text-sm font-medium mb-2">
        Upload Bank Proof
      </p>

      <input
        type="file"
        className="text-sm"
      />

      <button onClick={()=>navigate(-1)} className="mt-2 bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white px-4 py-1 rounded text-sm">
        Upload
      </button>
    </div>
  );
}
