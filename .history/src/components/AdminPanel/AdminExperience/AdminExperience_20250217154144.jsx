import { useEffect, useState } from "react";
import { getDatabase, ref, get, remove, update } from "firebase/database";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import { database } from "../../firebase"; // Adjust the path accordingly

const AdminExperience = () =xperiences] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    description: "",
    location: "",
    year: "",
    companyLogo: ""
  });

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

  // Handle Save After Edit
  const handleSaveEdit = (id) => {
    const experienceRef = ref(database, "experiences/" + id);
    update(experienceRef, editFormData)
      .then(() => {
        const updatedExperiences = experiences.map((exp) =>
          exp.id === id ? { ...exp, ...editFormData } : exp
        );
        setExperiences(updatedExperiences);
        setEditing(null);
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
            {/* Assuming Cloudinary URL is stored */}
            <img
              src={experience.companyLogo}
              alt={`${experience.company} Logo`}
              className="companyLogo"
            />
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
                <button onClick={() => handleSaveEdit(experience.id)}>
                  Save
                </button>
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
