import React, { useState, useEffect } from "react";
import { database, ref, get, set } from "../../../firebase/Firebase"; // Correct path to your firebase.js
import './AdminAbout.scss';

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState({
    about: "",
    description: "",
    contact: "",
    address: "",
    email: "",
    phone: "",
    socialLinks: {
      facebook: "",
      github: "",
      instagram: "",
      linkedin: "",
    },
    tags: ["HTML5", "CSS3 (Flexbox, Grid)", "JavaScript (ES6+)"], // Example tags
  });

  const [isEditing, setIsEditing] = useState({
    description: false,
    address: false,
    email: false,
    phone: false,
    socialLinks: {
      facebook: false,
      github: false,
      instagram: false,
      linkedin: false,
    },
    tags: false,
  });

  useEffect(() => {
    // Fetch data from Firebase when component mounts
    const fetchData = async () => {
      const dbRef = ref(database, 'about'); // Path to 'about' data in Firebase
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setAboutData(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialChange = (e, socialPlatform) => {
    const { value } = e.target;
    setAboutData((prevData) => ({
      ...prevData,
      socialLinks: {
        ...prevData.socialLinks,
        [socialPlatform]: value,
      },
    }));
  };

  const handleTagChange = (e, index) => {
    const { value } = e.target;
    const updatedTags = [...aboutData.tags];
    updatedTags[index] = value;
    setAboutData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

  const handleTagDelete = (index) => {
    const updatedTags = aboutData.tags.filter((_, i) => i !== index);
    setAboutData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

  const handleAddTag = () => {
    const newTag = prompt("Enter a new tag:");
    if (newTag) {
      setAboutData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, newTag],
      }));
    }
  };

  const handleSave = async () => {
    try {
      const dbRef = ref(database, 'about');
      await set(dbRef, aboutData);
      alert("Data updated successfully!");
      setIsEditing({
        description: false,
        address: false,
        email: false,
        phone: false,
        socialLinks: {
          facebook: false,
          github: false,
          instagram: false,
          linkedin: false,
        },
        tags: false,
      });
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Error updating data.");
    }
  };

  return (
    <div className="adminAbout">
      <h1>Edit About Section</h1>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={aboutData.description}
          onChange={handleChange}
          disabled={!isEditing.description}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, description: !prev.description }))}>
          {isEditing.description ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={aboutData.address}
          onChange={handleChange}
          disabled={!isEditing.address}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, address: !prev.address }))}>
          {isEditing.address ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={aboutData.email}
          onChange={handleChange}
          disabled={!isEditing.email}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, email: !prev.email }))}>
          {isEditing.email ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={aboutData.phone}
          onChange={handleChange}
          disabled={!isEditing.phone}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, phone: !prev.phone }))}>
          {isEditing.phone ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <h2>Social Links</h2>
        {['facebook', 'github', 'instagram', 'linkedin'].map((platform) => (
          <div key={platform}>
            <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
            <input
              type="url"
              name={platform}
              value={aboutData.socialLinks[platform]}
              onChange={(e) => handleSocialChange(e, platform)}
              disabled={!isEditing.socialLinks[platform]}
            />
            <button onClick={() => setIsEditing((prev) => ({
              ...prev,
              socialLinks: { ...prev.socialLinks, [platform]: !prev.socialLinks[platform] }
            }))}>
              {isEditing.socialLinks[platform] ? "Save" : "Edit"}
            </button>
          </div>
        ))}
      </div>

      <div className="form-group">
        <h2>Tags</h2>
        {aboutData.tags.map((tag, index) => (
          <div key={index} className="tag-item">
            <input
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(e, index)}
              disabled={!isEditing.tags}
            />
            {isEditing.tags && (
              <>
                <button onClick={() => handleTagDelete(index)}>Delete</button>
                <button onClick={() => setIsEditing((prev) => ({ ...prev, tags: false }))}>Save</button>
              </>
            )}
          </div>
        ))}
        <button onClick={handleAddTag}>Add Tag</button>
        <button onClick={() => setIsEditing((prev) => ({ ...prev, tags: !prev.tags }))}>
          {isEditing.tags ? "Save Tags" : "Edit Tags"}
        </button>
      </div>

      <div className="form-group">
        <button onClick={handleSave}>Save All Changes</button>
      </div>
    </div>
  );
};

export default AdminAbout;
