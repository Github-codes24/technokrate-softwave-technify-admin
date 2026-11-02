export default function StatusBadge({ status }) {
  const statusStr =
    typeof status === "string"
      ? status
      : typeof status === "object" && status !== null && status.name
      ? String(status.name)
      : status !== null && status !== undefined
      ? String(status)
      : "";

  const normalizedStatus = statusStr
    ? statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase()
    : "";

  const colors = {
    New: "bg-blue-100 text-blue-700 border border-blue-200",
    Submitted: "bg-amber-100 text-amber-700 border border-amber-200",
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Qualified: "bg-green-100 text-green-700 border border-green-200",
    Rejected: "bg-red-100 text-red-700 border border-red-200",
    Paid: "bg-purple-100 text-purple-700 border border-purple-200",
    Ongoing: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    Completed: "bg-teal-100 text-teal-700 border border-teal-200",
    Active: "bg-green-100 text-green-700 border border-green-200",
    Blocked: "bg-rose-100 text-rose-700 border border-rose-200",
    Inactive: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const badgeClass =
    colors[statusStr] ||
    colors[normalizedStatus] ||
    "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${badgeClass}`}
    >
      {statusStr || "N/A"}
    </span>
  );
}
