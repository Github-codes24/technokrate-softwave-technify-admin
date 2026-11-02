import React, { useState, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LayoutDashboard, Download, Printer, Filter, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";

const dummyLeads = [
  { date: "10 Jan", leads: 10, converted: 5, pending: 3, rejected: 2 },
  { date: "11 Jan", leads: 15, converted: 8, pending: 4, rejected: 3 },
  { date: "12 Jan", leads: 12, converted: 6, pending: 4, rejected: 2 },
  { date: "13 Jan", leads: 20, converted: 12, pending: 6, rejected: 2 },
  { date: "14 Jan", leads: 18, converted: 10, pending: 5, rejected: 3 },
  { date: "15 Jan", leads: 22, converted: 14, pending: 6, rejected: 2 },
];

const dummyAgents = [
  { name: "Raj Sharma", leads: 20, converted: 12, commission: "₹12,400" },
  { name: "Priya Patel", leads: 15, converted: 7, commission: "₹8,200" },
  { name: "Amit Verma", leads: 25, converted: 18, commission: "₹18,500" },
  { name: "Sneha Singh", leads: 18, converted: 11, commission: "₹11,800" },
  { name: "Kumar Reddy", leads: 22, converted: 15, commission: "₹15,300" },
];

const dummyProducts = [
  { name: "Premium Villa", leads: 30, converted: 20, revenue: "₹45L" },
  { name: "Luxury Apartment", leads: 25, converted: 15, revenue: "₹32L" },
  { name: "Budget Homes", leads: 20, converted: 10, revenue: "₹18L" },
  { name: "Commercial Space", leads: 15, converted: 8, revenue: "₹28L" },
];

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"];

const ReportsAnalysis = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const [dateRange, setDateRange] = useState("week");
  const printRef = useRef();

  const exportExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const getChartData = () => {
    switch(activeTab) {
      case "leads": return dummyLeads;
      case "agents": return dummyAgents;
      case "products": return dummyProducts;
      default: return [];
    }
  };

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Reports & Analytics
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Analytics Center</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="text-white text-sm">Updated: Today, 11:45 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-orange-100">
          {["leads", "agents", "products"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === tab
                ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md"
                : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
            >
              {tab === "leads"
                ? "Lead Analytics"
                : tab === "agents"
                  ? "Agent Performance"
                  : "Product Insights"}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-100">
          <Calendar className="w-4 h-4 text-orange-500" />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="outline-none text-sm text-gray-700"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => exportExcel(getChartData(), `${activeTab}_report`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-linear-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <p className="text-sm text-gray-600">Total Leads</p>
          <p className="text-2xl font-bold text-orange-700">97</p>
          <p className="text-xs text-orange-600 mt-1">↑ 12% from last week</p>
        </div>
        <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-blue-700">64.3%</p>
          <p className="text-xs text-blue-600 mt-1">↑ 8% from last week</p>
        </div>
        <div className="bg-linear-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <p className="text-sm text-gray-600">Revenue Generated</p>
          <p className="text-2xl font-bold text-emerald-700">₹1.23Cr</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 18% from last week</p>
        </div>
        <div className="bg-linear-to-r from-violet-50 to-violet-100 rounded-xl p-4 border border-violet-200">
          <p className="text-sm text-gray-600">Active Agents</p>
          <p className="text-2xl font-bold text-violet-700">24</p>
          <p className="text-xs text-violet-600 mt-1">↑ 5 from last month</p>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={printRef} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        {/* Chart Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "leads" && "Lead Conversion Trends"}
              {activeTab === "agents" && "Agent Performance Overview"}
              {activeTab === "products" && "Product Conversion Analysis"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Real-time analytics and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by:</span>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 outline-none">
              <option>All Categories</option>
              <option>High Priority</option>
              <option>New Leads</option>
            </select>
          </div>
        </div>

        {/* Chart Content */}
        {activeTab === "leads" && (
          <div className="space-y-8">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dummyLeads}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis 
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  name="Total Leads"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="converted"
                  name="Converted"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  name="Pending"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                <h3 className="font-semibold text-gray-800">Lead Conversion Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-sm text-gray-600">
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Total Leads</th>
                      <th className="px-6 py-3 text-left">Converted</th>
                      <th className="px-6 py-3 text-left">Pending</th>
                      <th className="px-6 py-3 text-left">Rejected</th>
                      <th className="px-6 py-3 text-left">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dummyLeads.map((lead) => (
                      <tr key={lead.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{lead.date}</td>
                        <td className="px-6 py-4">{lead.leads}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {lead.converted}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {lead.pending}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            {lead.rejected}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            {((lead.converted / lead.leads) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="space-y-8">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dummyAgents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis 
                  tick={{ fill: "#6b7280" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar 
                  dataKey="leads" 
                  name="Leads Handled" 
                  fill="#f97316" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="converted" 
                  name="Converted" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <h3 className="font-semibold text-gray-800">Agent Performance Ranking</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-sm text-gray-600">
                      <th className="px-6 py-3 text-left">Agent</th>
                      <th className="px-6 py-3 text-left">Leads Handled</th>
                      <th className="px-6 py-3 text-left">Converted</th>
                      <th className="px-6 py-3 text-left">Conversion Rate</th>
                      <th className="px-6 py-3 text-left">Commission Earned</th>
                      <th className="px-6 py-3 text-left">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dummyAgents.map((agent, index) => {
                      const rate = ((agent.converted / agent.leads) * 100).toFixed(1);
                      return (
                        <tr key={agent.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-linear-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <span className="font-medium">{agent.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{agent.leads}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {agent.converted}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {rate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">{agent.commission}</td>
                          <td className="px-6 py-4">
                            {parseFloat(rate) > 70 ? (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                Excellent
                              </span>
                            ) : parseFloat(rate) > 50 ? (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                Good
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                Average
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Product Conversion Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dummyProducts}
                      dataKey="converted"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dummyProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Converted']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Revenue Contribution</h3>
                <div className="space-y-4">
                  {dummyProducts.map((product, index) => {
                    const percentage = ((index + 1) * 25);
                    return (
                      <div key={product.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-gray-600">{product.revenue}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              background: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-violet-50 to-violet-100 px-6 py-4 border-b border-violet-200">
                <h3 className="font-semibold text-gray-800">Product Performance Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-sm text-gray-600">
                      <th className="px-6 py-3 text-left">Product</th>
                      <th className="px-6 py-3 text-left">Total Leads</th>
                      <th className="px-6 py-3 text-left">Converted</th>
                      <th className="px-6 py-3 text-left">Conversion Rate</th>
                      <th className="px-6 py-3 text-left">Revenue Generated</th>
                      <th className="px-6 py-3 text-left">Avg. Time to Convert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dummyProducts.map((product) => (
                      <tr key={product.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{product.name}</td>
                        <td className="px-6 py-4">{product.leads}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {product.converted}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {((product.converted / product.leads) * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{product.revenue}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                            {Math.floor(Math.random() * 10) + 5} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-linear-to-r from-orange-50 to-white rounded-2xl p-6 border border-orange-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-orange-200">
            <div className="text-orange-600 font-semibold mb-2">Top Performing Agent</div>
            <div className="text-2xl font-bold text-gray-800">Amit Verma</div>
            <div className="text-sm text-gray-600">72% conversion rate</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-blue-200">
            <div className="text-blue-600 font-semibold mb-2">Highest Revenue Product</div>
            <div className="text-2xl font-bold text-gray-800">Premium Villa</div>
            <div className="text-sm text-gray-600">₹45L revenue generated</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-emerald-200">
            <div className="text-emerald-600 font-semibold mb-2">Best Conversion Day</div>
            <div className="text-2xl font-bold text-gray-800">15 Jan</div>
            <div className="text-sm text-gray-600">14 leads converted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalysis;