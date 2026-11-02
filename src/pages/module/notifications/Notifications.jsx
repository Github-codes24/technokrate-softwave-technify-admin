import { Bell, Megaphone, AlertCircle, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
export default function Notifications() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-sm mb-6 py-6">
        {/* Heading and Icon in one line */}
        <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
          <Bell className="w-7 h-7" />
          <span>Notifications & Communication</span>
        </h1>

        {/* Breadcrumbs */}
        <div className="text-[15px] text-white flex items-center gap-2 mt-3">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
          </NavLink>

          <span className="text-white/60">›</span>
          <span className="text-white font-medium">
            Notifications and Communications
          </span>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-300">
          <Megaphone className="text-blue-500" />
          <h2 className="font-semibold text-lg">Announcements</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">🎉 New Product Launched</p>
            <p className="text-sm text-gray-600 mt-1">
              Axis Bank Credit Card is now live for all agents.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">💰 Payout Update</p>
            <p className="text-sm text-gray-600 mt-1">
              Payouts will be processed every Friday.
            </p>
          </div>
        </div>
      </div>

      {/* LEAD & PAYOUT NOTIFICATIONS */}

      <div className="bg-white rounded-xl shadow mb-6">
        {/* HEADER */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-300">
          <Bell className="text-green-500" />
          <h2 className="font-semibold text-lg">Lead & Payout Notifications</h2>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Lead Approved</p>
            <p className="text-sm text-gray-600 mt-1">
              Rahul Sharma's Credit Card lead has been approved.
            </p>
            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Payout Released</p>
            <p className="text-sm text-gray-600 mt-1">
              ₹1200 payout credited for BNPL lead.
            </p>
            <p className="text-xs text-gray-400 mt-1">Yesterday</p>
          </div>
        </div>
      </div>

      {/* INTERNAL ALERTS */}
      <div className="bg-white rounded-xl shadow">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-300">
          <AlertCircle className="text-red-500" />
          <h2 className="font-semibold text-lg">Internal Alerts</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
            <p className="font-medium text-red-700">⚠️ Fraud Alert</p>
            <p className="text-sm text-red-600 mt-1">
              Suspicious activity detected on lead ID #2345.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
            <p className="font-medium text-yellow-700">
              ⚠️ Pending Verification
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Multiple leads pending KYC verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
