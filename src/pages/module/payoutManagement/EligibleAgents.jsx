
const EligibleAgents = () => {

  /* 🔹 STATIC ELIGIBLE AGENTS DATA */
  const agents = [
    {
      _id: "1",
      agentName: "Rahul Sharma",
      phone: "9876543210",
      lastPaidAt: "2025-01-15",
      totalPaid: "₹45,000",
    },
    {
      _id: "2",
      agentName: "Amit Verma",
      phone: "9123456789",
      lastPaidAt: "2025-01-22",
      totalPaid: "₹72,000",
    },
    {
      _id: "3",
      agentName: "Neha Singh",
      phone: "9001122334",
      lastPaidAt: "2025-01-28",
      totalPaid: "₹38,000",
    },
  ];

  return (
    <div className="p-3">
      <h1 className="text-xl font-semibold mb-4">Eligible Agents</h1>

      <div className="overflow-x-auto shadow-xl rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#1d476e33] sticky top-0 z-10">
            <tr className="text-black uppercase text-xs tracking-wider">
              {["Sr.No", "Agent Name", "Phone", "Last Paid at", "Total Paid"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-sm font-medium"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {agents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No eligible agents found
                </td>
              </tr>
            )}

            {agents.map((agent, index) => (
              <tr key={agent._id || index}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{agent.agentName}</td>
                <td className="px-6 py-4">{agent.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-sm font-semibold">
                    {new Date(agent.lastPaidAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-sm font-semibold">
                    {agent.totalPaid}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EligibleAgents;
