import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Type, 
  Tag, 
  AlignLeft, 
  Loader2, 
  X 
} from 'lucide-react';

// Tiptap Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import { fetchPolicyDropdown } from '../../../redux/slice/tersmandconditions/getDropDownSlice';
import { createPolicy, resetState } from '../../../redux/slice/tersmandconditions/addprivacySlice';
import { toast } from "react-toastify";

// MenuBar Component for Editor
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-t-xl bg-gray-50 p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 rounded-lg font-bold ${editor.isActive("bold") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      > B </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 rounded-lg italic ${editor.isActive("italic") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      > I </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1.5 rounded-lg underline ${editor.isActive("underline") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      > U </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1.5 rounded-lg ${editor.isActive("bulletList") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      > • </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-3 py-1.5 rounded-lg ${editor.isActive({ textAlign: "center" }) ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      > ⫶ </button>
      <button
        type="button"
        onClick={addLink}
        className={`px-3 py-1.5 rounded-lg ${editor.isActive("link") ? "bg-orange-200 text-orange-800" : "hover:bg-gray-200"}`}
      > 🔗 </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="px-3 py-1.5 rounded-lg hover:bg-gray-200 text-red-600"
      > ✕ </button>
    </div>
  );
};

const TermsandConditions = () => {
  const dispatch = useDispatch();
  const { options, isLoading: isDropdownLoading } = useSelector((state) => state.policyDropdown);
  const { isSubmitting, success, error } = useSelector((state) => state.addPolicy);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: ''
  });

  // Tiptap Editor Initialization
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

  useEffect(() => {
    dispatch(fetchPolicyDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Terms and Conditions added successfully!", { autoClose: 1500 });
      setFormData({ title: '', description: '', type: '' });
      editor?.commands.setContent(""); // Clear editor content
      dispatch(resetState());
    }
    if (error) {
      toast.error(`Error: ${error.message || "Failed to create policy"}`);
      dispatch(resetState());
    }
  }, [success, error, dispatch, editor]);

  const leads = []; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate including rich text
    const isDescriptionEmpty = !formData.description || formData.description === "<p></p>";
    
    if (!formData.title || !formData.type || isDescriptionEmpty) {
      toast.warning("Please fill all fields", { autoClose: 1500 });
      return;
    }
    dispatch(createPolicy(formData));
  };

  return (
    <div className="min-h-screen md:p-6">
      {/* --- Breadcrumb / Header --- */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl  p-6 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Lead Management
            </h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink to="/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
                <span className="bg-white/20 px-3 py-1 rounded-lg">Dashboard</span>
              </NavLink>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Terms & Conditions</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-center">
            <p className="text-white text-xs uppercase tracking-wider opacity-80">Total Leads</p>
            <p className="text-white text-xl font-bold">{leads?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* --- Form Section --- */}
      <div className="max-w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="text-orange-500" />
            Policy Configuration
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Type size={16} className="text-orange-500" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Policy Title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50"
              />
            </div>

            {/* Type Dropdown */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag size={16} className="text-orange-500" />
                Type
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isDropdownLoading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-100 outline-none transition-all bg-gray-50 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isDropdownLoading ? "Loading options..." : "Select Policy Type"}
                  </option>
                  {options && options.map((item, index) => (
                    <option key={index} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  {isDropdownLoading ? <Loader2 className="h-5 w-5 text-orange-500 animate-spin" /> : <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>}
                </div>
              </div>
            </div>

            {/* Description with Tiptap Editor */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlignLeft size={16} className="text-orange-500" />
                Description
              </label>
              <div className="tiptap-editor-wrapper">
                <MenuBar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 min-h-[250px]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-orange-200 hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
              {isSubmitting ? "Publishing..." : "Publish Policy"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .tiptap-editor-wrapper .ProseMirror { padding: 1rem; min-height: 250px; outline: none; }
        .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before { color: #9ca3af; content: 'Enter description...'; float: left; pointer-events: none; height: 0; }
        .tiptap-editor-wrapper .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .tiptap-editor-wrapper .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
};

export default TermsandConditions;