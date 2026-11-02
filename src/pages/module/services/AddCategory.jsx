import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  FolderPlus,
  Upload,
  Tag,
  Hash,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  addcategory,
  resetCategoryState,
} from "../../../redux/slice/project/addcategory";
const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.addCategory);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryHeading: "",
    description: "",

    features: [""],
  });

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(resetCategoryState());
        navigate("/categories");
      }, 2000);
    }
  }, [success, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const updatedFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: updatedFeatures });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    const validFeatures = formData.features.filter(
      (feature) => feature.trim() !== "",
    );
    if (validFeatures.length === 0) {
      newErrors.features = "At least one feature is required";
    }

    if (!formData.image) {
      newErrors.image = "Category image is required";
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = "Only JPG, PNG, or WEBP images are allowed";
      } else if (formData.image.size > 5 * 1024 * 1024) {
        newErrors.image = "Image must be smaller than 5MB";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const filteredFeatures = formData.features.filter((f) => f.trim() !== "");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.categoryName.trim());
    formDataToSend.append("description", formData.description.trim());
    formDataToSend.append("features", JSON.stringify(filteredFeatures));
    formDataToSend.append("image", formData.image);

    for (let [key, value] of formDataToSend.entries()) {
      console.log("SENDING:", key, value);
    }

    dispatch(addcategory(formDataToSend));
  };

  return (
    <div className="p-6">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Category created successfully!</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">{error}</span>
          <button
            onClick={() => dispatch(resetCategoryState())}
            className="ml-2 hover:bg-red-600 rounded p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FolderPlus className="w-7 h-7" />
              Add New Category
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
              <NavLink
                to="/services"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  Projects
                </span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Add Category</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <p className="text-white text-sm">
              Organize your projects with categories
            </p>
          </div>
        </div>
      </div>

      {/* back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Form Container */}
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Category Details
            </h2>
            <p className="text-gray-600">
              Create a new category to organize your projects
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-500" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>Category Name</span>
                    <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      disabled={loading}
                      className={`w-full px-4 py-3 pl-11 rounded-xl border ${errors.categoryName ? "border-red-300" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white shadow-sm placeholder-gray-400 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    />
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  {errors.categoryName && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.categoryName}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>Description</span>
                  <span className="text-orange-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter category description..."
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.description ? "border-red-300" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white shadow-sm placeholder-gray-400 resize-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-gray-500">Minimum 10 characters</p>
              </div>
            </div>

            {/* Category Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Category Features
                <span className="text-orange-500">*</span>
              </h3>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder={`Feature ${index + 1}`}
                      disabled={loading}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        disabled={loading}
                        className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addFeature}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FolderPlus className="w-5 h-5" />
                  Add Feature
                </button>

                {errors.features && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.features}
                  </p>
                )}
              </div>
            </div>
            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Project Image <span className="text-orange-500">*</span>
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed ${
                    errors.image
                      ? "border-red-300 bg-red-50"
                      : "border-orange-300 bg-orange-50"
                  } rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-colors duration-300`}
                >
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    id="image-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-center"
                  >
                    <Upload
                      className={`w-12 h-12 ${
                        errors.image ? "text-red-400" : "text-orange-400"
                      } mb-4 mx-auto`}
                    />
                    <p className="text-gray-700 font-medium mb-2">
                      Click to upload project image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>

                {/* Preview Area */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Image Preview
                  </h3>
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Project preview"
                        className="w-full h-48 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium text-gray-700">
                        Preview
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-100 rounded-xl">
                      <p className="text-gray-400">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => navigate("/categories")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-5 h-5" />
                    Create Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-linear-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            📋 Category Creation Guidelines
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Category names should be clear and descriptive</li>
            <li>• Provide a detailed description (minimum 10 characters)</li>
            {/* <li>• Set an appropriate price for the category</li> */}
            <li>
              • Add at least one feature to help users understand category scope
            </li>
            <li>• All fields marked with * are required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
