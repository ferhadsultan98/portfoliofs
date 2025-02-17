import { useEffect, useState } from "react";
import { database, getDatabase, ref, get, remove, update } from "firebase/database";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import { database } from "../../firebase"; // Adjust path
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "../../../";
import { v4 as uuidv4 } from "uuid";

export default function AdminExperience() {
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

  const storage = getStorage(); // Firebase Storage instance

  // Fetch experiences from Firebase
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
      companyLogo: experience.companyLogo,
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

  // Upload image to Firebase Storage
  const uploadImageToFirebaseStorage = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = storageRef(storage, `experiences/${uuidv4()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Return the URL of the uploaded image
          });
        }
      );
    });
  };

  // Handle Save After Edit
  const handleSaveEdit = async (id) => {
    let newCompanyLogo = editFormData.companyLogo;

    // If a new image was selected, upload it
    if (image) {
      newCompanyLogo = await uploadImageToFirebaseStorage(image);
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
    <div className="adminExperienceContainer">
      {/* Top Section for Editing */}
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && <p>Selected Image: {image.name}</p>}
            {editFormData.companyLogo && !image && (
              <img src={editFormData.companyLogo} alt="Current logo" />
            )}
          </div>
          <button onClick={() => handleSaveEdit(editing)}>Save</button>
        </div>
      </div>

      {/* Bottom Section for Listing Fetched Experiences */}
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
                <button onClick={() => handleDelete(experience.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
