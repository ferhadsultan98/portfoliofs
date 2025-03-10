import { useState, useEffect } from "react";
import {
  database,
  ref,
  set,
  get,
  remove,
} from "../../../firebase/Firebase";
import axios from "axios";
import "./AdminProjects.scss";
import { FaGithub } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import toast from "react-hot-toast";

function AdminProjects() {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardTags, setCardTags] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const [cardCoverName, setCardCoverName] = useState("");
  const [cardGithubLink, setCardGithubLink] = useState("");
  const [cardBackgroundImage, setCardBackgroundImage] = useState(null); // For new image upload
  const [existingBackgroundImage, setExistingBackgroundImage] = useState(""); // For displaying existing image during edit
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const cloudinaryPreset = "farhadsultan";
  const cloudinaryCloudName = "dbiltdpxh";

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, "cards");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProjects(projectsArray);
      }
    };

    fetchData();
  }, []);

  const handleTagAdd = () => {
    if (cardTags && !tagsArray.includes(cardTags)) {
      setTagsArray([...tagsArray, cardTags]);
      setCardTags("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardBackgroundImage(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      toast.error("Image upload failed: " + error.message, {
        position: "top-center",
        style: {
          background: 'none',
          border: '1px solid #5a1d60',
          borderRadius: '15px',
          color: '#5a1d60',
        }
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let backgroundImageUrl = existingBackgroundImage;

    if (cardBackgroundImage) {
      backgroundImageUrl = await uploadImageToCloudinary(cardBackgroundImage);
      if (!backgroundImageUrl) {
        toast.error("Image upload failed. Please try again.", {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
        return;
      }
    }

    const newCardData = {
      cardTitle,
      cardDescription,
      cardTags: tagsArray,
      cardCoverName,
      cardGithubLink,
      cardBackgroundImage: backgroundImageUrl || "", // Store the image URL in Firebase
    };

    if (editId) {
      const cardRef = ref(database, "cards/" + editId);
      set(cardRef, newCardData)
        .then(() => {
          toast.success("Data updated successfully!", { position: "top-center" });
          clearForm();
          setProjects(projects.map((project) =>
            project.id === editId ? { id: editId, ...newCardData } : project
          ));
        })
        .catch((error) => {
          toast.error("Error updating data: " + error.message, { position: "top-center" });
        });
    } else {
      const cardRef = ref(database, "cards/" + new Date().getTime());
      set(cardRef, newCardData)
        .then(() => {
          toast.success("Data pushed to Firebase successfully!", { position: "top-center" });
          clearForm();
          setProjects([...projects, { id: cardRef.key, ...newCardData }]);
        })
        .catch((error) => {
          toast.error("Error pushing data to Firebase: " + error.message, { position: "top-center" });
        });
    }
  };

  const handleEdit = (id) => {
    const card = projects.find((project) => project.id === id);
    if (card) {
      setCardTitle(card.cardTitle);
      setCardDescription(card.cardDescription);
      setTagsArray(card.cardTags || []);
      setCardCoverName(card.cardCoverName);
      setCardGithubLink(card.cardGithubLink);
      setExistingBackgroundImage(card.cardBackgroundImage || "");
      setCardBackgroundImage(null); // Reset the image input
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const cardRef = ref(database, "cards/" + id);
    remove(cardRef)
      .then(() => {
        toast.success("Data deleted successfully!", { position: "top-center" });
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch((error) => {
        toast.error("Error deleting data: " + error.message, { position: "top-center" });
      });
  };

  const clearForm = () => {
    setCardTitle("");
    setCardDescription("");
    setCardCoverName("");
    setCardGithubLink("");
    setTagsArray([]);
    setCardBackgroundImage(null);
    setExistingBackgroundImage("");
    setEditId(null);
  };

  return (
    <div className="adminProjectContainer">
      <form onSubmit={handleSubmit}>
        <div className="adminProjectTopLeft">
          <label htmlFor="cardTitle">Card Title</label>
          <input
            type="text"
            id="cardTitle"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="cardDescription">Card Description</label>
          <textarea
            id="cardDescription"
            value={cardDescription}
            onChange={(e) => setCardDescription(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="cardCoverName">Card Cover Name</label>
          <input
            type="text"
            id="cardCoverName"
            value={cardCoverName}
            onChange={(e) => setCardCoverName(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="cardGithubLink">Card GitHub Link</label>
          <input
            type="url"
            id="cardGithubLink"
            value={cardGithubLink}
            onChange={(e) => setCardGithubLink(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="cardBackgroundImage">Card Background Image</label>
          <input
            type="file"
            id="cardBackgroundImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {cardBackgroundImage && <p>Selected Image: {cardBackgroundImage.name}</p>}
          {existingBackgroundImage && !cardBackgroundImage && (
            <img src={existingBackgroundImage} alt="Current background" style={{ maxWidth: "200px" }} />
          )}
          <button type="submit">
            {editId ? (
              <i>
                <RxUpdate />
              </i>
            ) : (
              <i>
                <IoAddCircleOutline />
              </i>
            )}
          </button>
        </div>

        <div className="adminProjectTopRight">
          <label htmlFor="cardTags">Card Tags</label>
          <input
            type="text"
            id="cardTags"
            value={cardTags}
            onChange={(e) => setCardTags(e.target.value)}
            autoComplete="off"
          />
          <button type="button" onClick={handleTagAdd}>
            <i><IoAddCircleOutline /></i>
          </button>

          <div>
            <h4>Tags:</h4>
            <ul>
              {tagsArray.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </form>

      <div className="existingProjects">
        <h3>Existing Projects</h3>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <h4>{project.cardTitle}</h4>
                <p>{project.cardDescription}</p>
                {project.cardBackgroundImage && (
                  <img src={project.cardBackgroundImage} alt="Background" style={{ maxWidth: "200px" }} />
                )}
                <ul>
                  {project.cardTags && project.cardTags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
                <p>
                  <a
                    href={project.cardGithubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub />
                  </a>
                </p>
                <button onClick={() => handleEdit(project.id)}>
                  <i>
                    <FiEdit3 />
                  </i>
                </button>
                <button onClick={() => handleDelete(project.id)}>
                  <i>
                    <MdDeleteOutline />
                  </i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Data</p>
        )}
      </div>
    </div>
  );
}

export default AdminProjects;