const PayoutDashboard = () => {

  /* 🔹 STATIC DASHBOARD DATA */
  const dashboard = {
    eligibleAgents: 12,
    pendingPayouts: 5,
    totalPaidThisMonth: "₹45,000",
    totalPaidTillDate: "₹3,20,000",
  };

  const stats = [
    { title: "Eligible Agents", value: dashboard.eligibleAgents },
    { title: "Pending Payouts", value: dashboard.pendingPayouts },
    { title: "Paid This Month", value: dashboard.totalPaidThisMonth },
    { title: "Total Payouts", value: dashboard.totalPaidTillDate },
  ];

  return (
    <div className="bg-white p-5 mt-5 rounded-2xl">
      <h2 className="font-semibold mb-4">Payout Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="rounded-xl p-5 shadow bg-blue-50">
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutDashboard;


