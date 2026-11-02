import { Archive, Edit2Icon, } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";


export default function FinancialProductManagement() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [form, setForm] = useState({
    name: "",
    category: "Credit Card",
    commission: "",
    payoutCycle: "Monthly",
  });

  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId ? { ...p, ...form } : p
        )
      );
      setEditingId(null);
    } else {
      setProducts([
        ...products,
        {
          id: Date.now(),
          ...form,
          status: true,
        },
      ]);
    }

    setForm({ name: "", category: "Credit Card", commission: "", payoutCycle: "Monthly" });
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = (id) => {
    const confirmdelete = window.confirm("Are yoy sure you want to delete this Product")
    if (!confirmdelete)
      return;
    const UpdateProduct = products.filter((p) => p.id !== id)
    setProducts(UpdateProduct);
    localStorage.setItem("products", JSON.stringify(UpdateProduct))

  };

  const toggleStatus = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, status: !p.status } : p
      )
    );
  };

  return (
    <div className="mt-5  min-h-screen">
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8]
                      rounded-2xl p-6 shadow-lg mb-6 mt-6">
        <h1 className="text-2xl font-semibold text-white">Financial Management</h1>

        <div className="text-[15px] text-white flex items-center gap-2 mt-2">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <LayoutDashboard size={16} />
          </NavLink>

          <span>&gt;</span>

          <span className="hover:text-blue-600 transition">
            Financials Management
          </span>
        </div>
      </div>
      {/* Add / Update Product */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Credit Card</option>
            <option>Loan</option>
            <option>Demat</option>
            <option>Account</option>
          </select>

          <input
            type="number"
            name="commission"
            placeholder="Commission %"
            value={form.commission}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <select
            name="payoutCycle"
            value={form.payoutCycle}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <button
            type="submit"
            className="md:col-span-4 bg-gradient-to-r from-[#0B1C2D] to-[#0E5FD8] text-white py-2 rounded hover:bg-blue-900"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className=" shadow-xl rounded-2xl overflow-x-auto">
        <table className="w-full text-sm ">
          <thead className="bg-[#0B1C2D] sticky top-0 z-10">
            <tr className="text-blue-100 uppercase text-sm tracking-wider">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-center">Category</th>
              <th className="p-4 text-center">Commission</th>
              <th className="p-4 text-center">Payout Cycle</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`border-t ${!product.status ? "bg-gray-200 text-gray-400" : "bg-white"}  hover:bg-blue-50`}
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3 text-center">{product.category}</td>
                <td className="p-3 text-center">{product.commission}%</td>
                <td className="p-3 text-center">{product.payoutCycle}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${product.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {product.status ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-red-500 "
                  >
                    <Edit2Icon className="w-5 h-6 text-blue-600 " />

                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Archive className="w-5 h-6 text-red-500 " />

                  </button>
                  {/* <button
                    onClick={() => toggleStatus(product.id)}
                    className={` px-2 py-1  rounded text-white ${product.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                  >
                    {product.status ? "Disable" : "Enable"}
                  </button> */}
                  <button className="px-2 py-1" onClick={() => toggleStatus(product.id)}
                  >
                    {product.status ? (
                      <FaToggleOn className="text-green-500 text-3xl " />
                    ) : (
                      <FaToggleOff className="text-red-400 text-3xl" />
                    )}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
