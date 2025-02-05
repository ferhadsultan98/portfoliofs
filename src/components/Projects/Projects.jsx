import React, { useEffect, useState } from "react";
import "./Projects.css";
import projectsData from "./projects.json";
import { IoLogoGithub, IoMdCloseCircleOutline  } from "react-icons/io";

const Projects = () => {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isClosing, setIsClosing] = useState(false); // State for tracking closing

  useEffect(() => {
    setCards(projectsData);
    const cardElements = document.querySelectorAll(".card");
    let delay = 0;

    cardElements.forEach((el) => {
      el.style.animation =
        "swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both";
      el.style.animationDelay = delay + "s";
      delay += 0.2;
    });
  }, []);

  const openModal = (card) => {
    setModalContent(card);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable body scroll
  };

  const closeModal = () => {
    setIsClosing(true); // Set to true to start closing animation
    document.body.style.overflow = "auto"; // Enable body scroll

    // Set a timeout to actually close the modal after the animation duration
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false); // Reset closing state
    }, 500); // Match this duration with the closing animation time (500ms)
  };

  return (
    <div
      className="ProjeContainer"
      id="projects"
      style={{ paddingTop: "80px" }}
    >
      <h1>Projects</h1>
      <hr className="project-separator" />
      <div className="card-container">
        {cards.map((card, index) => (
          <div className="card" key={index} onClick={() => openModal(card)}>
            <div className="card-main">
              <h1 alt={`${card.title} Logo`}>{card.coverName}</h1>
            </div>
            <div className="card-hover" id="cardInfo">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="tags">
                {card.tags.map((tag, tagIndex) => (
                  <div className="tag" key={tagIndex}>
                    {tag}
                  </div>
                ))}
              </div>
              <a
                href={card.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub size={40} color="white" />
              </a>
            </div>
          </div>
        ))}
      </div>


      {isModalOpen && (
        <div className={`modal ${isModalOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>{modalContent.title}</h2>
            <p>{modalContent.description}</p>
            <div className="tags">
              {modalContent.tags.map((tag, tagIndex) => (
                <div className="tag" key={tagIndex}>
                  {tag}
                </div>
              ))}
            </div>
            <a
              href={modalContent.githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoGithub size={40} color="white" />
            </a>
            <button className="close-btn" onClick={closeModal}><i><IoMdCloseCircleOutline style={{display: 'flex', fontSize: '24px'}}/></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
