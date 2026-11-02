import { LayoutDashboard, Save } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const AddFaq = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("NEW FAQ:", form);
    navigate("/faqs");
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#F7941D] to-[#0072BC] rounded-2xl p-6 mb-8 mt-6">
        <h1 className="text-2xl font-semibold text-white">Add FAQ</h1>
        <div className="text-white flex gap-2 text-sm mt-2">
          <NavLink to="/dashboard">
            <LayoutDashboard size={16} />
          </NavLink>
          <span>&gt;</span>
          <NavLink to="/faqs">FAQs</NavLink>
          <span>&gt;</span>
          <span>Add FAQs</span>
        </div>
      </div>

      <div className="max-w-full mx-auto bg-white p-8 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-5">
            <label htmlFor="question" className="text-gray-500 ">Enter question here</label>
          <input
            placeholder="Question"
            className="w-full border p-3 rounded mt-2"
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
          />
            <label htmlFor="question" className="text-gray-500 ">Enter answer here</label>
          <textarea
            placeholder="Answer"
            rows={5}
            className="w-full border p-3 mt-2 rounded"
            onChange={(e) =>
              setForm({ ...form, answer: e.target.value })
            }
          />

          <button className="flex items-center gap-2 bg-[#0072BC] text-white px-6 py-2 rounded">
            <Save size={18} />
            Save FAQ
          </button>
        </form>
      </div>
    </>
  );
};

export default AddFaq;
