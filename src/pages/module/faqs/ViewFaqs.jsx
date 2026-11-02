import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const ViewFaq = () => {
  const navigate = useNavigate();

  const faq = {
    question: "What is SoftwaveTechnify?",
    answer: "We provide best IT solutions.",
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
          <span>View FAQs</span>
        </div>
      </div>

      <div className="max-w-full mx-auto bg-white p-8 rounded-xl shadow">
        <p className="font-semibold">Question</p>
        <div className="bg-gray-100 p-3 rounded mb-4 mt-2">
          {faq.question}
        </div>

        <p className="font-semibold">Answer</p>
        <div className="bg-gray-100 p-3 rounded mt-2">
          {faq.answer}
        </div>

        <button
          onClick={() => navigate("/faqs")}
          className="mt-6 flex items-center gap-2 border px-4 py-2 rounded"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
    </>
  );
};

export default ViewFaq;
