import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Edit,
  ChevronRight,
  FileText,
  Plus,
  X,
  Save,
  ArrowLeft,
  AlertCircle,
  FolderPlus,
  Loader2,
  Image as ImageIcon,
  Type,
  AlignLeft,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";

// Tiptap Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

import {
  updateProject,
  resetUpdateState,
} from "../../../redux/slice/project/updateProjectSlice";

// MenuBar Component for Editor
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-200 rounded-t-xl bg-gray-50 p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded italic ${editor.isActive("italic") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded underline ${editor.isActive("underline") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive("bulletList") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        Center
      </button>
      <button
        type="button"
        onClick={addLink}
        className={`px-2 py-1 rounded ${editor.isActive("link") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      >
        🔗
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="px-2 py-1 rounded text-red-500 hover:bg-red-50"
      >
        Clear
      </button>
    </div>
  );
};

const EditService = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { loading, error, success } = useSelector(
    (state) => state.updateProject,
  );

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    typeName: "",
    description: "",
    price: "",
    features: [""],
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize Editor
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
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, description: html }));
    },
  });

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/admin/project/getprojectbyId/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          const project = response.data.data;
          const projectData = Array.isArray(project) ? project[0] : project;

          setFormData({
            projectName: projectData.projectName || "",
            projectType: projectData.projectType?._id || "",
            typeName: projectData.projectType?.name || "",
            description: projectData.description || "",
            price: projectData.price || "",
            features:
              projectData.features?.length > 0 ? projectData.features : [""],
            image: null,
          });

          // Sync description to editor
          if (editor && projectData.description) {
            editor.commands.setContent(projectData.description);
          }

          if (projectData.image) {
            setImagePreview(projectData.image.url);
          }
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
      }
    };

    if (id && editor) fetchExistingData();
  }, [id, BASE_URL, editor]);

  useEffect(() => {
    if (success) {
      dispatch(resetUpdateState());
      navigate(-1);
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () =>
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.projectName.trim())
      newErrors.projectName = "Name is required";
    if (!formData.price.toString().trim())
      newErrors.price = "Price is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append("projectName", formData.projectName);
    data.append("projectType", formData.projectType);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.image) {
      data.append("image", formData.image);
    }

    formData.features.forEach((feature) => {
      if (feature.trim()) {
        data.append("features[]", feature);
      }
    });

    dispatch(updateProject({ id, formData: data }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Edit Project
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
              <button
                onClick={() => navigate(-1)}
                className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors text-white"
              >
                All Projects
              </button>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Edit Projects</span>
            </div>
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

      <div className="max-w-full mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-orange-500" /> Project Name *
              </label>
              <input
                name="projectName"
                type="text"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              {errors.projectName && (
                <p className="text-xs text-red-500">{errors.projectName}</p>
              )}
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-orange-500" /> Project Type
              </label>
              <input
                name="typeName"
                type="text"
                value={formData.typeName}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none cursor-not-allowed text-gray-500"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2"> 
    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
      <span className="text-orange-500 font-extrabold">₹</span> Price *
    </label>
    <input
      name="price"
      type="text"
      value={formData.price}
      onChange={handleChange}
      placeholder="Enter project price"
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
    />
    {errors.price && (
      <p className="text-xs text-red-500">{errors.price}</p>
    )}
  </div>

          {/* Description with Tiptap Editor */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-orange-500" /> Description
            </label>
            <div className="tiptap-editor-container border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4 min-h-[200px] outline-none"
              />
            </div>
          </div>

          


          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-500" /> Service Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-55 h-55 border border-gray-300 rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Features Loop */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-500" /> Project Features
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add Feature
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature #${index + 1}`}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-400 outline-none bg-gray-50/50"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {loading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>

      <style>{`
        .ProseMirror { min-height: 200px; padding: 10px; outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
};

export default EditService;
