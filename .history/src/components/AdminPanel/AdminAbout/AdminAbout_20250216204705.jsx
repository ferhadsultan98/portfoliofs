/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { database, ref, get, set } from "../../../firebase/Firebase";
import "./AdminAbout.scss";
import { FiEdit3 } from "react-icons/fi";
import { IoIosSave } from "react-icons/io";

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState({
    description: "",
    header: "",
    contact: {
      address: "",
      email: "",
      phone: "",
    },
    socialLinks: {
      facebook: "",
      github: "",
      instagram: "",
      linkedin: "",
    },
    tags: [],
  });

  const [isEditing, setIsEditing] = useState({
    description: false,
    header: false,
    contact: {
      address: false,
      email: false,
      phone: false,
    },
    socialLinks: {
      facebook: false,
      github: false,
      instagram: false,
      linkedin: false,
    },
    tags: Array(aboutData.tags.length).fill(false),
  });

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, "about");
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setAboutData(snapshot.val());
        }
      } catch (error) {}
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

  const handleTagEdit = (index) => {
    setIsEditing((prev) => {
      const newEditingState = [...prev.tags];
      newEditingState[index] = !newEditingState[index];
      return { ...prev, tags: newEditingState };
    });
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const newTag = e.target.tagInput.value.trim();
    if (newTag) {
      setAboutData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, newTag],
      }));
    }
  };

  const handleTagDelete = (index) => {
    const updatedTags = aboutData.tags.filter((_, i) => i !== index);
    setAboutData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

  const handleSave = async (field) => {
    try {
      const dbRef = ref(database, "about");
      await set(dbRef, aboutData);
    } catch (error) {
      
    }
  };

  return (
    <div className="adminAbout">
      <div className="adminAboutTopSide">
        <div className="adminAboutTopLeft">
          <div className="form-group">
          <h2>Common</h2>
            <label>Header</label>
            <input
              type="text"
              name="header"
              value={aboutData.header}
              onChange={handleChange}
              disabled={!isEditing.header}
            />
            <button
              onClick={() => {
                setIsEditing((prev) => ({ ...prev, header: !prev.header }));
                handleSave("header");
              }}
            >
              {isEditing.header ? "Save" : <FiEdit3 />
}
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
            <button
              onClick={() => {
                setIsEditing((prev) => ({
                  ...prev,
                  description: !prev.description,
                }));
                handleSave("description");
              }}
            >
              {isEditing.description ? "Save" : <FiEdit3 />
}
            </button>
          </div>
        </div>
        <div className="adminAboutTopCenter">
        <h2>Contact</h2>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={aboutData.contact.address}
              onChange={(e) => handleContactChange(e, "address")}
              disabled={!isEditing.contact.address}
            />
            <button
              onClick={() => {
                setIsEditing((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, address: !prev.contact.address },
                }));
                handleSave("address");
              }}
            >
              {isEditing.contact.address ? "Save" : <FiEdit3 />
}
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
            <button
              onClick={() => {
                setIsEditing((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: !prev.contact.email },
                }));
                handleSave("email");
              }}
            >
              {isEditing.contact.email ? "Save" : <FiEdit3 />
}
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
            <button
              onClick={() => {
                setIsEditing((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: !prev.contact.phone },
                }));
                handleSave("phone");
              }}
            >
              {isEditing.contact.phone ? "Save" : <FiEdit3 />
}
            </button>
          </div>
        </div>
        <div className="adminAboutTopRight">
          <div className="form-group">
            <h2>Social Links</h2>
            {Object.keys(aboutData.socialLinks).map((platform) => (
              <div key={platform}>
                <label>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <input
                  type="url"
                  value={aboutData.socialLinks[platform]}
                  onChange={(e) => handleSocialChange(e, platform)}
                  disabled={!isEditing.socialLinks[platform]}
                />
                <button
                  onClick={() => {
                    setIsEditing((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [platform]: !prev.socialLinks[platform],
                      },
                    }));
                    handleSave(platform);
                  }}
                >
                  {isEditing.socialLinks[platform] ? "Save" : <FiEdit3 />
}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <h2>Tags</h2>
        <form onSubmit={handleTagAdd}>
          <input type="text" name="tagInput" placeholder="Add new tag" />
          <button type="submit">Add Tag</button>
        </form>

        {aboutData.tags.map((tag, index) => (
          <div key={index} className="tag-item">
            <input
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(e, index)}
              disabled={!isEditing.tags[index]}
            />
            <button
              onClick={() => {
                handleTagEdit(index);
                handleSave("tags");
              }}
            >
              {isEditing.tags[index] ? "Save" : <FiEdit3 />
}
            </button>
            <button onClick={() => handleTagDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAbout;
