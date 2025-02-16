import React, { useState, useEffect } from "react";
import { database, ref, get, set } from "../firebase"; // Ensure correct import for firebase.js
import './AdminAbout.scss';

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState({
    description: "",
    header: "",
    contact: {
      address: "",
      email: "",
      phone: ""
    },
    socialLinks: {
      facebook: "",
      github: "",
      instagram: "",
      linkedin: ""
    },
    tags: []
  });

  const [isEditing, setIsEditing] = useState({
    description: false,
    contact: {
      address: false,
      email: false,
      phone: false
    },
    socialLinks: {
      facebook: false,
      github: false,
      instagram: false,
      linkedin: false
    },
    tags: false
  });

  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, "about"); // Path to the 'about' data in Firebase
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

  const handleContactChange = (e, field) => {
    const { value } = e.target;
    setAboutData((prevData) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        [field]: value,
      },
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
      const dbRef = ref(database, "about");
      await set(dbRef, aboutData); // Save the data to Firebase
      alert("Data updated successfully!");
      setIsEditing({
        description: false,
        contact: {
          address: false,
          email: false,
          phone: false
        },
        socialLinks: {
          facebook: false,
          github: false,
          instagram: false,
          linkedin: false
        },
        tags: false
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
        <label>Header</label>
        <input
          type="text"
          name="header"
          value={aboutData.header}
          onChange={handleChange}
          disabled={!isEditing.header}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, header: !prev.header }))}>
          {isEditing.header ? "Save" : "Edit"}
        </button>
      </div>

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
          value={aboutData.contact.address}
          onChange={(e) => handleContactChange(e, "address")}
          disabled={!isEditing.contact.address}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, contact: { ...prev.contact, address: !prev.contact.address } }))}>
          {isEditing.contact.address ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={aboutData.contact.email}
          onChange={(e) => handleContactChange(e, "email")}
          disabled={!isEditing.contact.email}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, contact: { ...prev.contact, email: !prev.contact.email } }))}>
          {isEditing.contact.email ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={aboutData.contact.phone}
          onChange={(e) => handleContactChange(e, "phone")}
          disabled={!isEditing.contact.phone}
        />
        <button onClick={() => setIsEditing((prev) => ({ ...prev, contact: { ...prev.contact, phone: !prev.contact.phone } }))}>
          {isEditing.contact.phone ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-group">
        <h2>Social Links</h2>
        {Object.keys(aboutData.socialLinks).map((platform) => (
          <div key={platform}>
            <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
            <input
              type="url"
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
                <button onClick={() => setIsEditing((prev) => ({ ...prev, tags: !prev.tags }))}>
                  {isEditing.tags ? "Save" : "Edit"}
                </button>
              </>
            )}
          </div>
        ))}
        <button onClick={handleAddTag}>Add Tag</button>
      </div>

      <button className="save-btn" onClick={handleSave}>Save All Changes</button>
    </div>
  );
};

export default AdminAbout;
