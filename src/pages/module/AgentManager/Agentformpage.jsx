import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAgent, resetAddState,fetchVendors } from "../../../redux/slice/agentManagement/addAgentSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AgentForm from "./Agentform";

const AddAgentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux se state uthana
  const { loading, success, error,vendors,vendorsLoading } = useSelector((state) => state.addAgent);

  // Local state for form fields (Matches API Body)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "",
    // teamCode: "TEAM01",
     assignedToId: "",
    state: "",
    city: "",
    commissionRate: ""
  });

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleOnSubmit = () => {
    // API Call through Redux
    if (form.phone.length < 13) {
    toast.error("Please enter a valid 10-digit phone number");
    return;
  }
  const payload = {
    ...form,
    // Agar assignedToId khali hai toh null bhejein, warna wahi value rehne dein
    assignedToId: form.assignedToId === "" ? null : form.assignedToId
  };
    dispatch(createAgent(payload));
  };

  useEffect(() => {
    if (success) {
      toast.success("Agent added successfully!");
      dispatch(resetAddState());
      navigate("/agent"); // Redirect after success
    }
    if (error) {
      toast.error(error);
      dispatch(resetAddState());
    }
  }, [success, error, dispatch, navigate]);

  return (
    <AgentForm 
      form={form} 
      setForm={setForm} 
      onSubmit={handleOnSubmit} 
      title="Add New Agent" 
      loading={loading}
      vendors={vendors || []} 
      vendorsLoading={vendorsLoading}
    />
  );
};

export default AddAgentPage;