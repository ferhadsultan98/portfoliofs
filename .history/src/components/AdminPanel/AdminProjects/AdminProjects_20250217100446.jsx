import { useState, useEffect } from "react";
import {
  database,
  ref,
  set,
  get,
  child,
  remove,
} from "../../../firebase/Firebase";
import "./AdminProjects.scss";
import { FaEdit, FaGithub } from "react-icons/fa";

function AdminProjects() {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardTags, setCardTags] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const [cardCoverName, setCardCoverName] = useState("");
  const [cardGithubLink, setCardGithubLink] = useState("");
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCardData = {
      cardTitle,
      cardDescription,
      cardTags: tagsArray,
      cardCoverName,
      cardGithubLink,
    };

    if (editId) {
      const cardRef = ref(database, "cards/" + editId);
      set(cardRef, newCardData)
        .then(() => {
          alert("Data updated successfully!");
          clearForm();
        })
        .catch((error) => {
          alert("Error updating data: " + error);
        });
    } else {
      const cardRef = ref(database, "cards/" + new Date().getTime());
      set(cardRef, newCardData)
        .then(() => {
          alert("Data pushed to Firebase successfully!");
          clearForm();
        })
        .catch((error) => {
          alert("Error pushing data to Firebase: " + error);
        });
    }
  };

  const handleEdit = (id) => {
    const card = projects.find((project) => project.id === id);
    if (card) {
      setCardTitle(card.cardTitle);
      setCardDescription(card.cardDescription);
      setTagsArray(card.cardTags);
      setCardCoverName(card.cardCoverName);
      setCardGithubLink(card.cardGithubLink);
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const cardRef = ref(database, "cards/" + id);
    remove(cardRef)
      .then(() => {
        alert("Data deleted successfully!");
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch((error) => {
        alert("Error deleting data: " + error);
      });
  };

  const clearForm = () => {
    setCardTitle("");
    setCardDescription("");
    setCardCoverName("");
    setCardGithubLink("");
    setTagsArray([]);
    setEditId(null);
  };

  return (
    <div className="adminProjectContainer">
      <form onSubmit={handleSubmit}>
        <div className="adminProjectTopLeft">
          <label htmlFor="cardTitle">Card title</label>
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
          <label htmlFor="cardCoverName">Card Covername</label>
          <input
            type="text"
            id="cardCoverName"
            value={cardCoverName}
            onChange={(e) => setCardCoverName(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="cardGithubLink">Card Github Link</label>
          <input
            type="url"
            id="cardGithubLink"
            value={cardGithubLink}
            onChange={(e) => setCardGithubLink(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit">{editId ? "Update" : "Submit"}</button>
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
            Add Tag
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
                <ul>
                  {project.cardTags.map((tag, index) => (
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
                  Edit
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(project.id)}>
                  Delete
                  <i></i><MdDeleteOutline />
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
