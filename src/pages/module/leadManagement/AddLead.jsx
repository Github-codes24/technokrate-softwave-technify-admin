import { UserPlus, PlusCircle, ArrowLeft, Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createLead, resetState, fetchCategories } from '../../../redux/slice/leadManagement/addLeadSlice'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { toast } from "react-toastify";
import { TextStyle } from '@tiptap/extension-text-style'

const MenuBar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="border border-gray-300 rounded-t-xl bg-gray-50 p-2 flex flex-wrap gap-1">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${editor.isActive('bold') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}> B </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1.5 rounded-lg transition-colors italic ${editor.isActive('italic') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}> I </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-3 py-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}> • </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-3 py-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}> 1. </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button type="button" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className="px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-200 text-red-600"> ✕ </button>
    </div>
  )
}

const AddLead = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Added categories to the selector
  const { loading, success, error, categories } = useSelector((state) => state.addLead)

  const [formData, setFormData] = useState({
    projectName: '', // Field for project name
    name: '',
    phone: '',
    email: '',
    projectCategoryId: '', // Stores the selected ID
    price: '',
    message: '',
  })

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] }), Link.configure({ openOnClick: false }), Image, TextStyle, Color],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, message: editor.getText() })) 
    },
  })

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      // alert("Lead created successfully!");
      toast.success("Lead created Successfully!",{
        autoClose:1500
      })
      clearForm();
      dispatch(resetState());
      navigate("/leadmanagement");
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const apiBody = {
      projectName: formData.projectName || "New Project", 
      projectCategoryId: formData.projectCategoryId, 
      clientName: formData.name,
      clientPhone: formData.phone,
      clientEmail: formData.email,
      message: formData.message,
      price: formData.price
    }

    dispatch(createLead(apiBody))
  }

  const clearForm = () => {
    setFormData({ projectName: '', name: '', phone: '', email: '', projectCategoryId: '', price: '', message: '' })
    editor?.commands.setContent('')
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><UserPlus className="w-7 h-7" />Add New Lead</h1>
            <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
              <NavLink to="/dashboard" className="bg-white/20 px-3 py-1 rounded-lg hover:text-white transition-colors">Dashboard</NavLink>
              <span className="text-white/60">›</span>
              <NavLink to="/leadmanagement" className="bg-white/20 px-3 py-1 rounded-lg hover:text-white transition-colors">Leads</NavLink>
              <span className="text-white/60">›</span>
              <span className="font-medium text-white">Add Lead</span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">Capture new business inquiry details</div>
        </div>
      </div>

      <button onClick={() => navigate("/leadmanagement")} className="mb-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition">
        <ArrowLeft className="w-5 h-5" /> Back to Lead Management
      </button>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-800">Add new Lead</h2>
          <p className="text-gray-600">Please fill in the client's contact and project requirements</p>
          {error && <p className="text-red-500 mt-2 font-medium">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Project Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Project Name <span className="text-orange-500">*</span></label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="e.g. Blog website" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Client Name <span className="text-orange-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone <span className="text-orange-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-orange-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
            </div>

            {/* Project Category Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Project Category <span className="text-orange-500">*</span></label>
              <select
                name="projectCategoryId"
                value={formData.projectCategoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white transition-all text-gray-700"
              >
                <option value="">Select Category</option>
                {categories && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Budget Range</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="10000-20000" className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Message / Requirements</label>
            <div className="tiptap-editor-wrapper">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className="border border-t-0 border-gray-300 rounded-b-xl bg-white focus-within:ring-2 focus-within:ring-orange-400 min-h-[200px]" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={clearForm} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all">Reset Form</button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
      <style>{`.tiptap-editor-wrapper .ProseMirror { padding: 1rem; min-height: 200px; outline: none; } .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before { color: #9ca3af; content: 'Enter client requirements...'; float: left; height: 0; pointer-events: none; } .tiptap-editor-wrapper .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; } .tiptap-editor-wrapper .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }`}</style>
    </div>
  )
}

export default AddLead;