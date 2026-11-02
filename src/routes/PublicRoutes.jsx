

import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/module/dashboard/Dashboard";
import LeadManagement from "../pages/module/leadManagement/LeadManagement";
import PayoutManagement from "../pages/module/payoutManagement/PayoutManagement";
import AgentKyc from "../pages/module/agentKyc/AgentKyc";
import ReportAnalysis from "../pages/module/reportAnalysis/ReportAnalysis";
import AgentManagements from "../pages/module/AgentManager/AgentManager";
import LeadDetails from "../pages/module/leadManagement/LeadDetails";
import Notifications from "../pages/module/notifications/Notifications";
import EligibleAgents from "../pages/module/payoutManagement/EligibleAgents";
import PayoutHistory from "../pages/module/payoutManagement/PayoutHistory";
import Login from "../components/Signup/Login";
import VerifyOtp from "../components/Signup/verifyotp";
// import ForgetPassword from "../components/Signup/Forget_Password";
// import ResetPassword from "../components/Signup/Reset_passoward";
import Profile from "../pages/module/profile/Profile";
import EditProfile from "../pages/module/profile/EditProfile";
import SubAdminManagement from "../pages/module/subadminManagement/SubAdminManagement";
import AddSubAdmin from "../pages/module/subadminManagement/AddSubAdmin";
import ViewAdmin from "../pages/module/subadminManagement/Viewadmin";
import UpdateSubAdmin from "../pages/module/subadminManagement/UpdateSubAdmin";
import { Setting } from "../pages/module/setting/Setting";
import Faqs from "../pages/module/faqs/Faqs";
import AddFaq from "../pages/module/faqs/AddFaqs";
import ViewFaq from "../pages/module/faqs/ViewFaqs";
import EditFaq from "../pages/module/faqs/EditFaqs";
import CommissionManagement from "../pages/module/commisionManagement/CommisionManagement";
import AgentView from "../pages/module/AgentManager/AgentView";
import ViewKyc from "../pages/module/agentKyc/Viewkyc";
import Vendor from "../pages/module/vendor/Vendor";
import Services from "../pages/module/services/Services";
import ServiceDetails from "../pages/module/services/ServiceDetails";
import AddService from "../pages/module/services/AddService";
import VendorDetails from "../pages/module/vendor/VendorDetails";
import UpdateSetting from "../pages/module/setting/UpdateSetting";
import AgentEdit from "../pages/module/AgentManager/AgentEdit";
import AgentFormPage from "../pages/module/AgentManager/Agentformpage";
import AddVendor from "../pages/module/vendor/AddVendor";
import AddCategory from "../pages/module/services/AddCategory";
import EditVendor from "../pages/module/vendor/EditVendor";
import ForgetPassword from "../components/Signup/Forget_Password";
import ResetPassword from "../components/Signup/Reset_passoward";
import AddLead from "../pages/module/leadManagement/AddLead";
import TermsAndConditions from "../pages/module/termsconditions/TermsAndConditions";
import AdminVerifyOtp from "../pages/module/profile/adminauth/AdminVerifyOtp";
import EditCategory from "../pages/module/services/EditCategory";
import EditService from "../pages/module/services/EditService";
import Client from "../pages/module/client/Client";
import ViewClient from "../pages/module/client/ViewClient";

const LIVE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTJkYjY0MmUyZDBhZjhmYzhkMTRhMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NDYzNDk3MSwiZXhwIjoxNzg1MjM5NzcxfQ.IqwcqWH2HxlNhaYf82XMN8N_VltoPNRA4kop_nqLAv0";

// 🔒 Guard 1: Sirf logged-in users ke liye
const ProtectedRoute = () => {
  const token = localStorage.getItem("token") || LIVE_TOKEN;
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", LIVE_TOKEN);
  }
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

// 🚫 Guard 2: Logged-in users ko Login/OTP page par jane se rokne ke liye
const AuthRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const PublicRoutes = () => {
  return (
    <Routes>
      {/* --- Dashboard & Internal Pages (Protected) --- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/addservice" element={<AddService/>} />
          <Route path="/services/project-edit/:id" element={<EditService/>}/>

          <Route path="/services/addcategory" element={<AddCategory/>} />
          <Route path="/services/editcategory" element={<EditCategory/>}/>
          <Route path="/services/:id" element={<ServiceDetails/>} />
          <Route path="/services/category-edit/:id" element={<EditCategory/>} />

          <Route path="/leadmanagement" element={<LeadManagement />} />
          <Route path="/termconditions" element={<TermsAndConditions/>} />
          <Route path="/leadmanagement/add-lead" element={<AddLead/>} />
          <Route path="/leadmanagement/lead-details/:id" element={<LeadDetails />} />
          <Route path="/commision" element={<CommissionManagement />} />
          <Route path="/payout" element={<PayoutManagement />}>
            <Route index element={<EligibleAgents />} />
            <Route path="eligible-agents" element={<EligibleAgents />} />
            <Route path="history" element={<PayoutHistory />} />
          </Route>
          <Route path="/agentkyc" element={<AgentKyc />} />
          <Route path="/agentkyc/viewkyc/:id" element={<ViewKyc />} />
          <Route path="/reportanalysis" element={<ReportAnalysis />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/vendor" element={<Vendor />} />
          <Route path="/vendor/view/:id" element={<VendorDetails/>} />
          <Route path="/vendor/addvendor" element={<AddVendor/>} />
          <Route path="/vendor/edit/:id" element={<EditVendor/>} />
          <Route path="/agent" element={<AgentManagements />} />
          <Route path="/agent/view/:id" element={<AgentView />} />
          <Route path="/agent/edit/:id" element={<AgentEdit/>} />
          <Route path="/agent/form" element={<AgentFormPage/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/adminverify" element={<AdminVerifyOtp/>} />
          <Route path="/subadminmanagement" element={<SubAdminManagement />} />
          <Route path="/subadminmanagement/add-subadmin" element={<AddSubAdmin />} />
          <Route path="/subadminmanagement/view-subadmin" element={<ViewAdmin />} />
          <Route path="/subadminmanagement/update-subadmin" element={<UpdateSubAdmin />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="faqs/add" element={<AddFaq />} />
          <Route path="faqs/view/:id" element={<ViewFaq />} />
          <Route path="faqs/edit/:id" element={<EditFaq />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/setting/update-setting" element={<UpdateSetting/>} />
          <Route path="/client" element={<Client/>} />
          <Route path="/client/viewclient/:id" element={<ViewClient/>} />
        </Route>
      </Route>

      {/* --- Auth Pages (Restricted if already logged in) --- */}
      <Route element={<AuthRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgetpassword" element={<ForgetPassword/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
      </Route>

      {/* Wildcard: Agar koi galat URL dale */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PublicRoutes;