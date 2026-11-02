
const PayoutHistory = () => {

  /* 🔹 STATIC PAYOUT HISTORY DATA */
  const history = [
    {
      _id: "1",
      agentName: "Rahul Sharma",
      agentPhone: "9876543210",
      amountPaid: 1000,
      paidAt: "2025-01-12",
    },
    {
      _id: "2",
      agentName: "Amit Verma",
      agentPhone: "9123456789",
      amountPaid: 2000,
      paidAt: "2025-01-20",
    },
    {
      _id: "3",
      agentName: "Neha Singh",
      agentPhone: "9001122334",
      amountPaid: 3000,
      paidAt: "2025-01-28",
    },
  ];

  const loading = false;

  return (
    <div className="p-3">
      <h1 className="text-xl font-semibold mb-4">Payout History</h1>

      <div className="overflow-x-auto bg-white shadow-xl rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#1d476e33] sticky top-0 z-10">
            <tr className="text-black uppercase text-xs tracking-wider">
              {["Sr.No", "Agent Name", "Phone", "Amount", "Paid At"].map(
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
            {!loading && history.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No payout history found
                </td>
              </tr>
            )}

            {history.map((item, index) => (
              <tr key={item._id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.agentName}</td>
                <td className="px-6 py-4">{item.agentPhone}</td>
                <td className="px-6 py-4">₹{item.amountPaid}</td>
                <td className="px-6 py-4">
                  {new Date(item.paidAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutHistory;
