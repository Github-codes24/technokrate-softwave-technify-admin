import {
  Upload,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  FileText,
  FolderPlus,
  ArrowLeft,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  addproject,
  resetProjectState,
  getCategoryDropdown,
} from "../../../redux/slice/project/addproject";
import { useDispatch, useSelector } from "react-redux";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-t-xl bg-gray-50 p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 rounded-lg font-bold ${editor.isActive("bold") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 rounded-lg italic ${editor.isActive("italic") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1.5 rounded-lg underline ${editor.isActive("underline") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        U
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 rounded-lg font-bold ${editor.isActive("heading", { level: 1 }) ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 rounded-lg font-bold ${editor.isActive("heading", { level: 2 }) ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        H2
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1.5 rounded-lg ${editor.isActive("bulletList") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-3 py-1.5 rounded-lg ${editor.isActive({ textAlign: "center" }) ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        ⫶
      </button>
      <button
        type="button"
        onClick={addLink}
        className={`px-3 py-1.5 rounded-lg ${editor.isActive("link") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        🔗
      </button>
      <button
        type="button"
        onClick={addImage}
        className="px-3 py-1.5 rounded-lg hover:bg-gray-200"
      >
        🖼️
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        className="px-3 py-1.5 rounded-lg hover:bg-gray-200 text-red-600"
      >
        ✕
      </button>
    </div>
  );
};

const AddService = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, categories, categoriesLoading } =
    useSelector(
      (state) =>
        state.addProject || {
          loading: false,
          error: null,
          success: false,
          categories: [],
          categoriesLoading: false,
        },
    );

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    description: "",
    price: "",
    image: null,
    features: [""], // Initializing with one empty feature
  });

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(getCategoryDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(resetProjectState());
        navigate("/services");
      }, 2000);
    }
  }, [success, navigate, dispatch]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
      TextStyle,
      Color,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  // Feature Handlers
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
    if (errors.features) setErrors({ ...errors, features: "" });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectName.trim())
      newErrors.projectName = "Project name is required";
    if (!formData.projectType.trim())
      newErrors.projectType = "Project type is required";
    if (
      !formData.description ||
      formData.description.trim() === "<p></p>" ||
      formData.description.trim().length < 10
    ) {
      newErrors.description = "Description is required (min 10 chars)";
    }
    if (!formData.image) newErrors.image = "Project image is required";

    // Check if at least one feature is filled
    const filledFeatures = formData.features.filter((f) => f.trim() !== "");
    if (filledFeatures.length === 0) {
      newErrors.features = "At least one feature is required";
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

    const formDataToSend = new FormData();
    formDataToSend.append("projectName", formData.projectName.trim());
    formDataToSend.append("projectType", formData.projectType.trim());
    formDataToSend.append("description", formData.description.trim());
    formDataToSend.append("price", String(formData.price).trim());
    formDataToSend.append("image", formData.image);

    // Bhejne se pehle empty features filter kar dein
    const finalFeatures = formData.features.filter((f) => f.trim() !== "");

    // Backend expectation ke hisaab se array ya JSON string bhejein
    finalFeatures.forEach((feature) => {
      formDataToSend.append("features[]", feature);
    });

    dispatch(addproject(formDataToSend));
  };

  const handleClearAll = () => {
    setFormData({
      projectName: "",
      projectType: "",
      description: "",
      price: "",
      image: null,
      features: [""],
    });
    setPreviewImage(null);
    setErrors({});
    editor?.commands.setContent("");
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Project created successfully!</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">{error}</span>
          <button
            onClick={() => dispatch(resetProjectState())}
            className="ml-2 hover:bg-red-600 rounded p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <PlusCircle className="w-7 h-7" /> Add New Project
              </h1>
              <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
                <NavLink
                  to="/dashboard"
                  className="bg-white/20 px-3 py-1 rounded-lg"
                >
                  Dashboard
                </NavLink>
                <span>›</span>
                <NavLink
                  to="/services"
                  className="bg-white/20 px-3 py-1 rounded-lg"
                >
                  Projects
                </NavLink>
                <span>›</span>
                <span className="text-white font-medium">Add Project</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 mx-5 text-gray-500 hover:text-orange-600 font-medium transition"
      >
        <ArrowLeft size={18} /> Back
      </button>
      <div className="max-w-8xl mx-5 bg-white rounded-2xl shadow-lg p-6 border border-orange-100 mb-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border ${errors.projectName ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-orange-400 outline-none`}
              />
              {errors.projectName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.projectName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Project Type *
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                disabled={loading || categoriesLoading}
                className={`w-full px-4 py-3 rounded-xl border ${errors.projectType ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-orange-400 outline-none bg-white`}
              >
                <option value="">
                  {categoriesLoading ? "Loading..." : "Select Type"}
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.projectType}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Price Range (e.g. 120000-150000) *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </div>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="MinPrice-MaxPrice"
                  disabled={loading}
                  className={`w-full pl-10 px-4 py-3 rounded-xl border ${errors.price ? "border-red-300" : "border-gray-300"} focus:ring-2 focus:ring-orange-400 outline-none`}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description *
            </label>
            <div className="tiptap-editor-wrapper">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                className={`border border-t-0 ${errors.description ? "border-red-300" : "border-gray-300"} rounded-b-xl bg-white min-h-[250px]`}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Integrated Category Features Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Project Features <span className="text-orange-500">*</span>
            </h3>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm placeholder-gray-400"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      disabled={loading}
                      className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
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
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-orange-400 hover:text-orange-600 transition-colors w-full justify-center"
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

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Project Image *
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`border-2 border-dashed ${errors.image ? "border-red-300 bg-red-50" : "border-orange-300 bg-orange-50"} rounded-2xl p-8 text-center cursor-pointer hover:bg-orange-100 transition-all`}
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
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload
                    className={`w-12 h-12 mx-auto mb-4 ${errors.image ? "text-red-400" : "text-orange-400"}`}
                  />
                  <p className="font-medium text-gray-700">
                    Click to upload image
                  </p>
                </label>
              </div>
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                    alt="Preview"
                  />
                ) : (
                  <p className="text-gray-400">No image selected</p>
                )}
              </div>
            </div>
            {errors.image && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.image}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Clear All
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" /> Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .tiptap-editor-wrapper .ProseMirror { padding: 1rem; min-height: 250px; outline: none; }
        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before { color: #9ca3af; content: 'Enter description...'; float: left; pointer-events: none; height: 0; }
        .tiptap-editor-wrapper .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .tiptap-editor-wrapper .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default AddService;
