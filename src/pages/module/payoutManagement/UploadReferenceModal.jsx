const UploadReferenceModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Upload Payment Reference</h2>

        <input
          type="number"
          placeholder="Transaction / UTR Number"
          className="w-full border rounded p-2"
        />

        <input
          type="date"
          className="w-full border rounded p-2"
        />

        <input
          type="file"
          className="w-full border rounded p-2"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadReferenceModal;
