import { Eye, Edit2, Trash2, LayoutDashboard, PlusIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Faq() {
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([
    {
      id: "1",
      question: "What is SoftwaveTechnify?",
      answer: "We provide best IT services.",
    },
    {
      id: "2",
      question: "Is support available?",
      answer: "Yes, 24/7 support available.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    setFaqs(faqs.filter((f) => f.id !== selectedId));
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#F7941D] to-[#0072BC] rounded-2xl p-6 mb-8 mt-6">
        <h1 className="text-2xl font-semibold text-white">FAQs</h1>
        <div className="text-white flex items-center gap-2 mt-2 text-sm">
          <NavLink to="/dashboard">
            <LayoutDashboard size={16} />
          </NavLink>
          <span>&gt;</span>
          <span>FAQs</span>
        </div>
      </div>

      {/* SEARCH + ADD */}
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 px-4 py-2 border rounded-lg"
        />

        <button
          onClick={() => navigate("/faqs/add")}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white px-4 py-2 rounded"
        >
          <PlusIcon size={18} />
          Add FAQ
        </button>
      </div>

      {/* TABLE */}
     <div className="bg-white p-6 rounded-xl shadow">
  {/* Heading */}
  <h2 className="text-xl font-semibold mb-5 text-center">
    FAQs Management
  </h2>

  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-center">
      
      {/* TABLE HEAD */}
      <thead className="bg-[#1d476e33] sticky top-0 z-10">
        <tr className="text-black uppercase text-xs tracking-wider">
          {["Sr.No", "Question", "Answer", "Actions"].map((col) => (
            <th
              key={col}
              className="p-4 text-sm font-medium text-center"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      {/* TABLE BODY */}
      <tbody className="bg-white divide-y divide-gray-200">
        
        {filteredFaqs.length === 0 && (
          <tr>
            <td colSpan="4" className="py-6 text-gray-400 text-center">
              No FAQs found
            </td>
          </tr>
        )}

        {filteredFaqs.map((faq, i) => (
          <tr
            key={faq.id}
            className="hover:bg-gray-50 transition"
          >
            {/* Sr No */}
            <td className="px-6 py-4 font-medium text-center">
              {i + 1}
            </td>

            {/* Question */}
            <td className="px-6 py-4 font-medium text-gray-800 text-center">
              {faq.question}
            </td>

            {/* Answer */}
            <td className="px-6 py-4 text-gray-600 text-center">
              {faq.answer}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-center">
              <div className="flex justify-center gap-4">
                <Eye
                  size={18}
                  className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
                  onClick={() => navigate(`/faqs/view/${faq.id}`)}
                />

                <Edit2
                  size={18}
                  className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
                  onClick={() => navigate(`/faqs/edit/${faq.id}`)}
                />

                <Trash2
                  size={18}
                  className="text-red-600 cursor-pointer hover:text-red-800 transition"
                  onClick={() => {
                    setSelectedId(faq.id);
                    setShowDeleteModal(true);
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[350px]">
            <p className="mb-4">Delete this FAQ?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
