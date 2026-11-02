import { useState } from "react";
import revenueLogo from "../../../assets/softwaveLogo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

const UpdateSetting = ({ initialData, onCancel, onSave }) => {
  const [form, setForm] = useState(
    initialData || {
      websiteName: "SoftwaveTechnify",
      description: "India's trusted Service provider platform",
      contactEmail: "support@softwavetechnify.com",
      contactPhone: "+91 9876543210",
      aboutUs: "We provide best services.",
      logo: {
        url: revenueLogo,
      },
      socialLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
      },
    }
  );

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogoChange = (value) => {
    setForm({ ...form, logo: { url: value } });
  };

  const handleSocialChange = (key, value) => {
    setForm({
      ...form,
      socialLinks: {
        ...form.socialLinks,
        [key]: value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Settings:", form);
    onSave && onSave(form);
  };

  const socialIcons = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedinIn />,
    youtube: <FaYoutube />,
  };

  return (
<div className="px-6 mt-6">
      <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-7 h-7" />
              Setting Management
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
                to="/setting"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  Setting
                </span>
              </NavLink>
              <span className="text-white/60">›</span>
             
              <span className="text-white font-medium">Update Setting</span>
            </div>
          </div>
          
        </div>
      </div>
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold  text-gray-800 mb-4">
        Update Settings
      </h2>

      <input
        value={form.websiteName}
        onChange={(e) => handleChange("websiteName", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        placeholder="Website Name"
      />

      <input
        value={form.logo.url}
        onChange={(e) => handleLogoChange(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        placeholder="Logo URL"
      />

      <textarea
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        placeholder="Description"
      />

      <input
        value={form.contactEmail}
        onChange={(e) => handleChange("contactEmail", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        placeholder="Contact Email"
      />

      <input
        value={form.contactPhone}
        onChange={(e) => handleChange("contactPhone", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        placeholder="Contact Phone"
      />

      <textarea
        value={form.aboutUs}
        onChange={(e) => handleChange("aboutUs", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        placeholder="About Us"
      />

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form.socialLinks).map(([key, url]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-gray-600 text-lg">
              {socialIcons[key]}
            </span>
            <input
              value={url}
              onChange={(e) => handleSocialChange(key, e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              placeholder={`${key} URL`}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="border px-5 py-2 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-[#0072BC] text-white px-6 py-2 rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </form>
    </div>
  );
};

export default UpdateSetting;
