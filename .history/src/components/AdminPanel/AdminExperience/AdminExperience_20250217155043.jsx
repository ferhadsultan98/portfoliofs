import { useEffect, useState } from "react";
import { getDatabase, ref, get, remove, update } from "../../../firebase/Firebase";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import { database } from "../../firebase"; // Adjust the path accordingly
import axios from "axios"; // For uploading image to Cloudinary

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    description: "",
    location: "",
    year: "",
    companyLogo: "", // New field for company logo
  });
  const [image, setImage] = useState(null); // Image state

  // Fetch experiences from Firebase
  useEffect(() => {
    const experiencesRef = ref(database, "experiences"); // Path to your experiences data
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

  // Handle Delete Experience
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

  // Handle Edit Experience
  const handleEdit = (id) => {
    const experience = experiences.find((exp) => exp.id === id);
    setEditing(id);
    setEditFormData({
      company: experience.company,
      description: experience.description,
      location: experience.location,
      year: experience.year,
      companyLogo: experience.companyLogo, // Setting the current logo URL
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

  // Handle image upload to Cloudinary
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected file to state
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_cloudinary_preset"); // Replace with your Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
        formData
      );
      return res.data.secure_url; // Get the image URL
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
          exp.id === id ? { ...exp, ...editFormData, companyLogo: newCompanyLogo } : exp
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
    <div className="experiencesContainer" id="experience">
      {experiences.map((experience) => (
        <div className="experienceItem" key={experience.id}>
          <div className="experiencesLeftSide">
            {/* Show image or edit image */}
            {editing === experience.id ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {image && <p>Selected Image: {image.name}</p>}
              </div>
            ) : (
              <img
                src={experience.companyLogo}
                alt={`${experience.company} Logo`}
                className="companyLogo"
              />
            )}
          </div>
          <div className="experiencesRightSide">
            <div className="experiencesRightSideTopSection">
              {editing === experience.id ? (
                <input
                  type="text"
                  name="company"
                  value={editFormData.company}
                  onChange={handleInputChange}
                />
              ) : (
                <h2 className="company">{experience.company}</h2>
              )}
              {editing === experience.id ? (
                <input
                  type="text"
                  name="year"
                  value={editFormData.year}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="year">
                  <LuCalendarDays />
                  {experience.year}
                </p>
              )}
            </div>
            <hr style={{ margin: "15px 0" }} />
            <div className="experiencesRightSideBottomSection">
              {editing === experience.id ? (
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="location">
                  <MdLocationOn />
                  {experience.location}
                </p>
              )}
              {editing === experience.id ? (
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="description">{experience.description}</p>
              )}
            </div>
            <div className="actions">
              {editing === experience.id ? (
                <button onClick={() => handleSaveEdit(experience.id)}>Save</button>
              ) : (
                <button onClick={() => handleEdit(experience.id)}>Edit</button>
              )}
              <button onClick={() => handleDelete(experience.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
