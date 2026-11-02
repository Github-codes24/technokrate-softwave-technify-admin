import { LayoutDashboard, ArrowLeft, Loader2, Edit, FileText } from "lucide-react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
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
import {
  fetchCategoryDetail,
  fetchProjectsByCategory,toggleProjectStatus,

} from "../../../redux/slice/project/getProjectsByCategory";
import { useEffect } from "react";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";
import DOMPurify from "dompurify";
const ServiceDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

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

  const getRandomImage = (index) => imageArray[index % imageArray.length];

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryDetail(id));
      dispatch(fetchProjectsByCategory(id));
    }
  }, [dispatch, id]);

  const {
    categoryData,
    projects,
    categoryLoading,
    projectsLoading,
    categoryError,
    projectsError,
    loadingProjectId,
    updateLoading
  } = useSelector((state) => state.singleProject);

  // Loading & Error States
  if (categoryLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderSpinner className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (categoryError || projectsError || !categoryData?.category) {
    return (
      <div className="p-6 text-center mt-20">
        <h2 className="text-xl font-bold text-red-600">Dataare not load</h2>
        <button
          onClick={() => navigate("/services")}
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Services
        </button>
      </div>
    );
  }

  const category = categoryData.category;

  // --- SAFE STRING EXTRACTION LOGIC (Fixes NaNL) ---
  const getSafePrice = () => {
    try {
      // Agar "120000-160000" jaisa string hai
      const minStr = String(categoryData.minPrice || 0);
      const maxStr = String(categoryData.maxPrice || 0);

      const start = minStr.split("-")[0].trim();
      const endParts = maxStr.split("-");
      const end = endParts[endParts.length - 1].trim();

      // Agar data 100000 se upar hai toh 'L' suffix lagayenge manually
      // warna direct string dikhayenge
      return `${start}-${end}`;
    } catch (e) {
      return "0-0";
    }
  };

  const finalPrice = getSafePrice();

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Project Management
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink
                to="/dashboard"
                className="bg-white/20 px-3 py-1 rounded-lg"
              >
                Dashboard
              </NavLink>
              <span className="text-white/60">›</span>
              <NavLink
                to="/services"
                className="bg-white/20 px-3 py-1 rounded-lg"
              >
                All Projects
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">{category.name}</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-white">
            {projects.length} Projects
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/services")}
        className="mb-4 flex items-center gap-2 text-orange-600 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" /> Back to All Categories
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl p-9 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src={category.image?.url || getRandomImage(0)}
            alt={category.name}
            className="w-full max-w-md rounded-xl object-contain"
          />
          <div>
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                {category.name}
              </h1>

              <Edit
                onClick={() =>
                  navigate(`/services/category-edit/${category._id}`)
                }
                className="text-orange-500"
              />
            </div>
            {/* PRICE DISPLAY FIX */}
            <p className="text-2xl font-semibold text-blue-600 mb-4">
              ₹{finalPrice}
            </p>

            <div
              className="text-slate-600 mb-6 leading-relaxed prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />

            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2 text-slate-600 mb-6">
              {category.features?.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> {item}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-blue-700">
                  {projects.length}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Price Range</p>
                <p className="text-lg font-bold text-emerald-700">
                  ₹{finalPrice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
     <div className="py-12">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">
    Projects in this Category
  </h2>

  {/* Check agar projects array mein data hai ya nahi */}
  {projects && projects.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((proj, index) => (
        <div
          key={proj._id}
          className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col group"
        >
          {/* ... aapka existing project card code yahan rahega ... */}
          <div className="relative h-52 bg-orange-50 overflow-hidden">
             {/* Edit Button, Image, etc. */}
             <button
                onClick={() => navigate(`/services/project-edit/${proj._id}`)}
                className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-md text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <Edit className="w-5 h-5" />
              </button>
              {/* Image Logic */}
              {proj.image?.url ? (
                <img src={proj.image.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold text-2xl">{proj.projectName?.[0]}</div>
              )}
          </div>

          <div className="p-6 flex-1 flex flex-col h-full border-t border-gray-50">
             {/* Header, Description (dangerouslySetInnerHTML), Features */}
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900">{proj.projectName}</h3>
                <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg border border-orange-200">
                  ₹{proj.price > 99999 ? `${(proj.price / 100000).toFixed(1)}L` : proj.price}
                </span>
             </div>
             
             <div
                className="text-gray-500 prose prose-orange max-w-none text-sm mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: proj.description }}
              />

              {/* Features logic as you have it... */}
{/* Projects Grid Section mein map ke andar niche wala code replace karein */}

<div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
<button
  onClick={() => dispatch(toggleProjectStatus(proj._id))}
  // Sirf tab disable hoga jab isi specific project ki ID process ho rahi ho
  disabled={updateLoading && loadingProjectId === proj._id}
  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 ${
    proj.status === "active" 
      ? "bg-green-50 text-green-600 border border-green-100 hover:bg-green-100" 
      : "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  }`}
>
  {/* Loader sirf usi card mein dikhega jiski ID match hogi */}
  {updateLoading && loadingProjectId === proj._id ? (
    <Loader2 className="w-3 h-3 animate-spin" />
  ) : (
    <span className={`w-1.5 h-1.5 rounded-full ${proj.status === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
  )}
  {proj.status || "Status"}
</button>
  
 </div>

          </div>
        </div>
      ))}
    </div>
  ) : (
    /* No Projects Found State */
    <div className=" rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
        <FileText className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
      <p className="text-gray-500 max-w-xs mx-auto">
        Is category mein abhi koi projects available nahi hain.
      </p>
    </div>
  )}
</div>
      
    </div>
  );
};

export default ServiceDetails;
