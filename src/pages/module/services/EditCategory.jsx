// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, NavLink } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCategoryById,
//   updateCategory,
//   resetEditState,
// } from "../../../redux/slice/project/editCategorySlice";
// import {
//   Upload,
//   Save,
//   ArrowLeft,
//   Loader2,
//   FolderPlus,
//   PlusCircle,
//   Trash2,
//   FileText,
//   AlignLeft,
//   ImageIcon,
//   ListChecks,
// } from "lucide-react";
// import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

// const EditCategory = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { category, loading, updateLoading, success, error } = useSelector(
//     (state) => state.editCategory,
//   );

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     image: null,
//   });
//   const [features, setFeatures] = useState([""]);
//   const [preview, setPreview] = useState("");

//   useEffect(() => {
//     dispatch(fetchCategoryById(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (category && category.category) {
//       const catInfo = category.category;
//       setFormData({
//         name: catInfo.name || "",
//         description: catInfo.description || "",
//         image: null,
//       });
//       setPreview(catInfo.image?.url || "");
//       if (Array.isArray(catInfo.features) && catInfo.features.length > 0) {
//         setFeatures(catInfo.features);
//       } else {
//         setFeatures([""]);
//       }
//     }
//   }, [category]);

//   useEffect(() => {
//     if (success) {
//       dispatch(resetEditState());
//       navigate("/services");
//     }
//   }, [success, navigate, dispatch]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setFormData({ ...formData, image: files[0] });
//       setPreview(URL.createObjectURL(files[0]));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleFeatureChange = (index, value) => {
//     const updated = [...features];
//     updated[index] = value;
//     setFeatures(updated);
//   };

//   const addFeature = () => setFeatures([...features, ""]);

//   const removeFeature = (index) => {
//     if (features.length === 1) return;
//     setFeatures(features.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("description", formData.description);
//     const filteredFeatures = features.filter((f) => f.trim() !== "");
//     filteredFeatures.forEach((f) => data.append("features[]", f));
//     if (formData.image) data.append("image", formData.image);
//     dispatch(updateCategory({ id, formData: data }));
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center mt-30 p-20">
//         <LoaderSpinner className="animate-spin text-orange-500" />
//       </div>
//     );

//   return (
//     <div className="p-6 max-w-full mx-auto bg-gray-50/40 min-h-screen">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-white flex items-center gap-3">
//               <FolderPlus className="w-7 h-7" />
//               Update Category
//             </h1>
//             <div className="text-sm text-orange-100 flex items-center gap-2 mt-3">
//               <NavLink
//                 to="/dashboard"
//                 className="flex items-center gap-1 hover:text-white transition-colors"
//               >
//                 <span className="bg-white/20 px-3 py-1 rounded-lg">
//                   Dashboard
//                 </span>
//               </NavLink>
//               <span className="text-white/60">›</span>
//               <button
//                 onClick={() => navigate(-1)}
//                 className="flex items-center gap-1 hover:text-white transition-colors"
//               >
//                 Projects Details
//               </button>
//               <span className="text-white/60">›</span>
//               <span className="text-white font-medium">Update Category</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={() => navigate(-1)}
//         className="mb-5 flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium transition"
//       >
//         <ArrowLeft size={18} /> Back
//       </button>

//       <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
//         {/* Card Header */}
//         <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5">
//           <h2 className="text-white text-lg font-bold tracking-wide">
//             Update Project Category
//           </h2>
//           <p className="text-orange-100 text-sm mt-0.5">
//             Edit the details below and save your changes
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 space-y-7">
//           {/* Category Name */}
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//               <FileText size={15} className="text-orange-500" />
//               Category Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g. Residential"
//               required
//               className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm transition"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//               <AlignLeft size={15} className="text-orange-500" />
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="4"
//               placeholder="Write a brief description about this category..."
//               className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm resize-none transition"
//             />
//           </div>

//           {/* Category Features — Dynamic Array */}
//           <div className="space-y-3">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//               <ListChecks size={15} className="text-orange-500" />
//               Category Features <span className="text-red-500">*</span>
//             </label>

//             <div className="space-y-3">
//               {features.map((feature, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                   <div className="flex-1 relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
//                       {index + 1}
//                     </span>
//                     <input
//                       type="text"
//                       value={feature}
//                       onChange={(e) =>
//                         handleFeatureChange(index, e.target.value)
//                       }
//                       placeholder={`Feature ${index + 1}`}
//                       className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm transition"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeFeature(index)}
//                     disabled={features.length === 1}
//                     className="p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {/* Add Feature Button */}
//             <button
//               type="button"
//               onClick={addFeature}
//               className="w-full py-3 border-2 border-dashed border-orange-300 rounded-xl text-orange-500 hover:bg-orange-50 hover:border-orange-400 font-semibold text-sm flex items-center justify-center gap-2 transition"
//             >
//               <PlusCircle size={18} />
//               Add Feature
//             </button>
//           </div>

//           {/* Image Upload */}
//           <div className="space-y-3">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//               <ImageIcon size={15} className="text-orange-500" />
//               Category Image
//             </label>
//             <div className="flex items-center gap-6">
//               <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt="preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center gap-1 text-gray-300">
//                     <Upload size={24} />
//                     <span className="text-xs">No Image</span>
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:bg-orange-50 transition">
//                   <span className="text-sm text-orange-500 font-medium">
//                     Click to upload image
//                   </span>
//                   <span className="text-xs text-gray-400 mt-1">
//                     PNG, JPG, WEBP supported
//                   </span>
//                   <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="border-t border-gray-100 pt-4 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={updateLoading}
//               className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 text-sm"
//             >
//               {updateLoading ? (
//                 <>
//                   <Loader2 size={18} className="animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditCategory;






import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryById,
  updateCategory,
  resetEditState,
} from "../../../redux/slice/project/editCategorySlice";
import {
  Upload,
  Save,
  ArrowLeft,
  Loader2,
  FolderPlus,
  PlusCircle,
  Trash2,
  FileText,
  AlignLeft,
  ImageIcon,
  ListChecks,
} from "lucide-react";
import LoaderSpinner from "../../../components/uiElement/LoaderSpinner";

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

// Simple MenuBar for Description
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-xs font-bold ${editor.isActive('bold') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-xs italic ${editor.isActive('italic') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded text-xs underline ${editor.isActive('underline') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}
      >
        U
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-xs ${editor.isActive('bulletList') ? 'bg-orange-200 text-orange-800' : 'hover:bg-gray-200'}`}
      >
        • List
      </button>
    </div>
  );
};

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { category, loading, updateLoading, success, error } = useSelector(
    (state) => state.editCategory,
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [features, setFeatures] = useState([""]);
  const [preview, setPreview] = useState("");

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (category && category.category) {
      const catInfo = category.category;
      setFormData({
        name: catInfo.name || "",
        description: catInfo.description || "",
        image: null,
      });
      setPreview(catInfo.image?.url || "");
      
      // Update editor content when data is fetched
      if (editor && catInfo.description) {
        editor.commands.setContent(catInfo.description);
      }

      if (Array.isArray(catInfo.features) && catInfo.features.length > 0) {
        setFeatures(catInfo.features);
      } else {
        setFeatures([""]);
      }
    }
  }, [category, editor]);

  useEffect(() => {
    if (success) {
      dispatch(resetEditState());
      navigate("/services");
    }
  }, [success, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => setFeatures([...features, ""]);

  const removeFeature = (index) => {
    if (features.length === 1) return;
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    const filteredFeatures = features.filter((f) => f.trim() !== "");
    filteredFeatures.forEach((f) => data.append("features[]", f));
    if (formData.image) data.append("image", formData.image);
    dispatch(updateCategory({ id, formData: data }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-30 p-20">
        <LoaderSpinner className="animate-spin text-orange-500" />
      </div>
    );

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-50/40 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FolderPlus className="w-7 h-7" />
              Update Category
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
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Projects Details
              </button>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Update Category</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5">
          <h2 className="text-white text-lg font-bold tracking-wide">
            Update Project Category
          </h2>
          <p className="text-orange-100 text-sm mt-0.5">
            Edit the details below and save your changes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-7">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={15} className="text-orange-500" />
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Residential"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm transition"
            />
          </div>

          {/* Description with Editor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <AlignLeft size={15} className="text-orange-500" />
              Description
            </label>
            <div className="border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-400 transition overflow-hidden">
              <MenuBar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none px-4 py-3 min-h-[150px] outline-none text-gray-700" 
              />
            </div>
          </div>

          {/* Category Features — Dynamic Array */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ListChecks size={15} className="text-orange-500" />
              Category Features <span className="text-red-500">*</span>
            </label>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder={`Feature ${index + 1}`}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    disabled={features.length === 1}
                    className="p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Feature Button */}
            <button
              type="button"
              onClick={addFeature}
              className="w-full py-3 border-2 border-dashed border-orange-300 rounded-xl text-orange-500 hover:bg-orange-50 hover:border-orange-400 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <PlusCircle size={18} />
              Add Feature
            </button>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImageIcon size={15} className="text-orange-500" />
              Category Image
            </label>
            <div className="flex items-center gap-6">
              <div className="w-55 h-55 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-300">
                    <Upload size={24} />
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:bg-orange-50 transition">
                  <span className="text-sm text-orange-500 font-medium">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP supported
                  </span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-100 pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateLoading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {updateLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .ProseMirror { min-height: 150px; outline: none; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
};

export default EditCategory;