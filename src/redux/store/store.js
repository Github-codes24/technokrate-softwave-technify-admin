import { configureStore } from "@reduxjs/toolkit";
// import loginReducer from "./loginSlice"; // Path sahi check kar lena
// import verifyReducer from "./verifySlice";
import loginReducer from "../slice/auth/loginSlice"
import verifyReducer from "../slice/auth/verifySlice"
import allLeadsReducer from "../slice/leadManagement/getAllLeadSlice";
import addLeadReducer from "../slice/leadManagement/addLeadSlice"
import singleLeadReducer from "../slice/leadManagement/getSingleLead";
import leadDropdownReducer from "../slice/leadManagement/leadDropdownSlice"
import changeStatusReducer from "../slice/leadManagement/changeStatusSlice"
import allVendorsReducer from "../slice/vendors/getallVendorsSlice"
import vendorDetailsReducer from "../slice/vendors/getVendorDetailsSlice"
import addVendorReducer from "../slice/vendors/addVendorSlice"
import allAgentsReducer from "../slice/agentManagement/getAllAgentSlice"
import singleAgentReducer from "../slice/agentManagement/getSingleAgentSlice"
import updateAgentReducer from "../slice/agentManagement/updateAgentSlice"
import addAgentReducer from "../slice/agentManagement/addAgentSlice"
import updateVendorReducer from "../slice/vendors/updateVendor"
import dropdownReducer from "../slice/tersmandconditions/getDropDownSlice"
import addPolicyReducer from "../slice/tersmandconditions/addprivacySlice"
import addCategoryReducer from "../slice/project/addcategory"
import addProjectReducer  from "../slice/project/addproject"
import getAllProjectCategoryReducer from "../slice/project/getallprojectcategory"
import getProjectsByCategoryReducer from "../slice/project/getProjectsByCategory"
import profileReducer from "../slice/profile/getProfile"
import editProfileReducer from "../slice/profile/editProfileSlice"
import userStatusReducer from "../slice/kycmanagement/agentKycSlice"
import bankDetailsReducer from "../slice/kycmanagement/bankDetailsSlice"
import commissionReducer from "../slice/commisionManagement/commissionSlice"
import editCategoryReducer from "../slice/project/editCategorySlice"
import updateProjectReducer from "../slice/project/updateProjectSlice"
import clientReducer from "../slice/client/clientSlice"
import viewClientReducer from "../slice/client/viewClient"
import changeclientStatusReducer from "../slice/client/changeclientStatus"
export const store = configureStore({
  reducer: {
    login: loginReducer,
    verify: verifyReducer,

    allLeads: allLeadsReducer,
    singleLead: singleLeadReducer,
    changeStatus: changeStatusReducer,
    leadDropdown: leadDropdownReducer,
    addLead: addLeadReducer,

    clients: clientReducer,
    viewClient: viewClientReducer,
    changeStatus: changeclientStatusReducer,

    allVendors: allVendorsReducer,
    addVendor: addVendorReducer,
    allAgents: allAgentsReducer,
    singleAgent: singleAgentReducer,
    updateAgent: updateAgentReducer,
    addAgent: addAgentReducer,
    vendorDetails: vendorDetailsReducer,
    updateVendor: updateVendorReducer,
    policyDropdown: dropdownReducer,
    addPolicy: addPolicyReducer,
    addCategory: addCategoryReducer,
    editCategory: editCategoryReducer,
    addProject: addProjectReducer,
    allProjectCategories: getAllProjectCategoryReducer,
   singleProject: getProjectsByCategoryReducer,
   updateProject: updateProjectReducer,

    profile: profileReducer,
    editProfile: editProfileReducer,
    userkyc: userStatusReducer,
    bankDetails: bankDetailsReducer,
    commission: commissionReducer,
  },
});

export default store;


