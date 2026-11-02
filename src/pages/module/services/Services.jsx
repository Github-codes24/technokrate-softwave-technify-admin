import { LayoutDashboard, PlusCircle, Eye, Filter, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import website from "../../../assets/services/website.webp";
import app from "../../../assets/services/app.png";
import ecommerce from "../../../assets/services/ecommerce.webp";
import erp from "../../../assets/services/erpw.webp";
import cms from "../../../assets/services/cms.png";
import crm from "../../../assets/services/crm.avif";
import customSoftware from "../../../assets/services/custom.webp";
import productDevelopment from "../../../assets/services/productdev2.png";
import digitalTransformation from "../../../assets/services/dig.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjectCategory } from "../../../redux/slice/project/getallprojectcategory";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const imageArray = [
    website,
    app,
    ecommerce,
    erp,
    cms,
    crm,
    customSoftware,
    productDevelopment,
    digitalTransformation,
  ];

  const getRandomImage = (index) => {
    return imageArray[index % imageArray.length];
  };

  useEffect(() => {
    dispatch(fetchAllProjectCategory());
  }, [dispatch]);

  const { projectCategories, loading, error } = useSelector(
    (state) => state.allProjectCategories,
  );

  // --- PRICE EXTRACTION HELPER ---
  const formatPriceRange = (minStr, maxStr) => {
    try {
      // String se first part extract karna: "120000-160000" -> "120000"
      const start = minStr ? String(minStr).split("-")[0].trim() : "0";
      // String se last part extract karna: "75000-120000" -> "120000"
      const maxParts = maxStr ? String(maxStr).split("-") : ["0"];
      const end = maxParts[maxParts.length - 1].trim();

      return `₹${start} - ₹${end}`;
    } catch (e) {
      return "₹0 - ₹0";
    }
  };

  const services = Array.isArray(projectCategories)
    ? projectCategories.map((category, index) => ({
        id: category._id,
        title: category.name,
        shortDesc: category.description,
        projects: category.projectCount || 0,
        // FIXED: NaNL issue resolved here
        priceRange: formatPriceRange(category.minPrice, category.maxPrice),
        status: "active",
        image: category.image?.url || getRandomImage(index),
        features: category.features || [],
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }))
    : [];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || service.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Project Management
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  Dashboard
                </span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">All Projects</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <p className="text-white text-sm">
              {services.length} Total Project Types
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm placeholder-gray-400"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="planning">Planning</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <button
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            onClick={() => navigate("/services/addcategory")}
          >
            <PlusCircle className="w-5 h-5" />
            Add Category
          </button>

          <button
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            onClick={() => navigate("/services/addservice")}
          >
            <PlusCircle className="w-5 h-5" />
            Add Project
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <LoaderSpinner />
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Project Categories
            </h2>
            <span className="text-sm text-gray-600">
              {filteredServices.length} of {services.length} categories
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/services/${item.id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-orange-300"
              >
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white mb-6 h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <div
                  className="text-gray-600 text-sm mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.shortDesc),
                  }}
                />

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Projects</p>
                    <p className="font-semibold text-gray-800">
                      {item.projects}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Price Range</p>
                    <p className="font-semibold text-gray-800 text-[10px] sm:text-xs">
                      {item.priceRange}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">View</p>
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">
                No projects found
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
