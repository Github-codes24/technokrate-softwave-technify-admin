
import { LayoutDashboard, Save } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: "Sample Question",
    answer: "Sample Answer",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("UPDATED FAQ:", id, form);
    navigate("/faqs");
  };

  return (
    <>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#F7941D] to-[#0072BC] rounded-2xl p-6 mb-8 mt-6">
        <h1 className="text-2xl font-semibold text-white">FAQs</h1>
        <div className="text-white flex items-center gap-2 mt-2 text-sm">
          <NavLink to="/dashboard">
            <LayoutDashboard size={16} />
          </NavLink>
          <span>&gt;</span>
           <NavLink to="/faqs">
           <span>FAQ</span>
          </NavLink>
          <span>&gt;</span>
          <span>Edit FAQs</span>
        </div>
      </div>

      <div className="max-w-full mx-auto bg-white p-8 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={form.question}
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <textarea
            value={form.answer}
            onChange={(e) =>
              setForm({ ...form, answer: e.target.value })
            }
            rows={5}
            className="w-full border p-3 rounded"
          />

          <button className="flex items-center gap-2 bg-[#0072BC] text-white px-6 py-2 rounded">
            <Save size={18} />
            Update FAQ
          </button>
        </form>
      </div>
    </>
  );
};

export default EditFaq;
