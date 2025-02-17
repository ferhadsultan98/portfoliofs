import { useEffect, useState } from "react";
import {
  database,
  getDatabase,
  ref,
  get,
  remove,
  update,
} from "../../../firebase/Firebase";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import axios from "axios"; 
import './AdminExperience.scss'

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    description: "",
    location: "",
    year: "",
    companyLogo: "",
  });
  const [image, setImage] = useState(null);

  const cloudinaryPreset = "farhadsultan";
  const cloudinaryCloudName = "dbiltdpxh";

  useEffect(() => {
    const experiencesRef = ref(database, "experiences");
    get(experiencesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const experienceList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setExperiences(experienceList);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = (id) => {
    const experienceRef = ref(database, "experiences/" + id);
    remove(experienceRef)
      .then(() => {
        setExperiences(experiences.filter((exp) => exp.id !== id));
      })
      .catch((error) => {
        console.error("Delete failed: ", error);
      });
  };

  const handleEdit = (id) => {
    const experience = experiences.find((exp) => exp.id === id);
    setEditing(id);
    setEditFormData({
      company: experience.company,
      description: experience.description,
      location: experience.location,
      year: experience.year,
      companyLogo: experience.companyLogo, // Set current logo URL
    });
  };

  // Handle form input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image change (file selection)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
    }
  };


  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, // Cloudinary upload URL
        formData
      );
      return res.data.secure_url; 
    } catch (error) {
      console.error("Image upload failed", error);
      return null;
    }
  };

  // Handle Save After Edit
  const handleSaveEdit = async (id) => {
    let newCompanyLogo = editFormData.companyLogo;

    // If a new image was selected, upload it
    if (image) {
      newCompanyLogo = await uploadImageToCloudinary(image);
      if (!newCompanyLogo) {
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    const experienceRef = ref(database, "experiences/" + id);
    update(experienceRef, {
      ...editFormData,
      companyLogo: newCompanyLogo,
    })
      .then(() => {
        const updatedExperiences = experiences.map((exp) =>
          exp.id === id
            ? { ...exp, ...editFormData, companyLogo: newCompanyLogo }
            : exp
        );
        setExperiences(updatedExperiences);
        setEditing(null);
        setImage(null); // Reset image state
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });
  };

  return (
    <div className="adminExperienceContainer">
      <div className="adminExperienceEditSection">
        <h3>Edit Experience</h3>
        <div className="editForm">
          <div className="editInputGroup">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={editFormData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="editInputGroup">
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={editFormData.year}
              onChange={handleInputChange}
            />
          </div>
          <div className="editInputGroup">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={editFormData.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="editInputGroup">
            <label>Description</label>
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="editInputGroup">
            <label>Company Logo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <p>Selected Image: {image.name}</p>}
            {editFormData.companyLogo && !image && (
              <img src={editFormData.companyLogo} alt="Current logo" />
            )}
          </div>
          <button onClick={() => handleSaveEdit(editing)}>Save</button>
        </div>
      </div>

    
      <div className="adminExperienceCards">
        <h3>Experience List</h3>
        {experiences.map((experience) => (
          <div className="experienceCard" key={experience.id}>
            <div className="experienceCardLeft">
              <img
                src={experience.companyLogo}
                alt={experience.company}
                className="companyLogo"
              />
            </div>
            <div className="experienceCardRight">
              <div className="experienceCardHeader">
                <h4>{experience.company}</h4>
                <p className="year">
                  <LuCalendarDays />
                  {experience.year}
                </p>
              </div>
              <div className="experienceCardBody">
                <p className="location">
                  <MdLocationOn />
                  {experience.location}
                </p>
                <p className="description">{experience.description}</p>
              </div>
              <div className="experienceCardActions">
                <button onClick={() => handleEdit(experience.id)}>Edit</button>
                <button onClick={() => handleDelete(experience.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminExperience;
