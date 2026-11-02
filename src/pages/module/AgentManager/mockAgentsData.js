export const sampleAgentsDetails = {
  "1": {
    _id: "1",
    name: "Manshri Wankhade",
    phone: "+918080337517",
    email: "manshri.w@example.com",
    occupation: "Lead Generation",
    city: "Nagpur",
    state: "Maharashtra",
    commissionRate: 5,
    leadCount: 2,
    submittedLeads: 1,
    approvedLeads: 1,
    rejectedLeads: 0,
    totalLeads: 2,
    isActive: false,
    bankDetails: { isKycVerified: false },
    isRegistered: true,
    accessedByAdmin: false,
    registrationSource: "Self",
    creatorName: "—",
    leads: [
      { _id: "l1", clientName: "Amit Sharma", clientPhone: "+919876543211", projectName: "Residential Villa Project", projectCategory: "Real Estate", price: 15000, status: "Pending", createdAt: new Date().toISOString() },
      { _id: "l2", clientName: "Neha Gupta", clientPhone: "+919876543212", projectName: "E-Commerce App development", projectCategory: "Software Dev", price: 45000, status: "Approved", createdAt: new Date().toISOString() }
    ]
  },
  "2": {
    _id: "2",
    name: "Sayali Mankar",
    phone: "+917249472591",
    email: "sayali.m@example.com",
    occupation: "Agent Manager",
    city: "Pune",
    state: "Maharashtra",
    commissionRate: 10,
    leadCount: 1,
    submittedLeads: 0,
    approvedLeads: 1,
    rejectedLeads: 0,
    totalLeads: 1,
    isActive: true,
    bankDetails: { isKycVerified: true },
    isRegistered: true,
    accessedByAdmin: true,
    registrationSource: "Self",
    creatorName: "—",
    leads: [
      { _id: "l3", clientName: "Rohan Varma", clientPhone: "+919876543213", projectName: "Commercial Shop Sale", projectCategory: "Real Estate", price: 25000, status: "Approved", createdAt: new Date().toISOString() }
    ]
  },
  "3": {
    _id: "3",
    name: "Hemant Khutmode",
    phone: "+919049132627",
    email: "hemant.k@example.com",
    occupation: "Sales Representative",
    city: "Mumbai",
    state: "Maharashtra",
    commissionRate: 8,
    leadCount: 0,
    submittedLeads: 0,
    approvedLeads: 0,
    rejectedLeads: 0,
    totalLeads: 0,
    isActive: true,
    bankDetails: { isKycVerified: false },
    isRegistered: true,
    accessedByAdmin: false,
    registrationSource: "Self",
    creatorName: "—",
    leads: []
  },
  "4": {
    _id: "4",
    name: "Rohan Patil",
    phone: "+919876543210",
    email: "rohan.p@example.com",
    occupation: "Agent",
    city: "Nagpur",
    state: "Maharashtra",
    commissionRate: 12,
    leadCount: 2,
    submittedLeads: 1,
    approvedLeads: 1,
    rejectedLeads: 0,
    totalLeads: 2,
    isActive: true,
    bankDetails: { isKycVerified: true },
    isRegistered: true,
    accessedByAdmin: true,
    registrationSource: "Admin",
    creatorName: "Chetan Chitriv",
    leads: [
      { _id: "l4", clientName: "Sanjay Dutta", clientPhone: "+919876543214", projectName: "Apartment Lead", projectCategory: "Real Estate", price: 8000, status: "Pending", createdAt: new Date().toISOString() },
      { _id: "l5", clientName: "Rajesh Kumar", clientPhone: "+919876543215", projectName: "Website Redesign", projectCategory: "Software Dev", price: 12000, status: "Approved", createdAt: new Date().toISOString() }
    ]
  }
};

export const getSampleAgentsList = () => {
  return Object.values(sampleAgentsDetails);
};
