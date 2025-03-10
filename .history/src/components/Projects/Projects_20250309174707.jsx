import { useEffect, useState } from "react";
import { database, ref, get } from '../../firebase/Firebase';  
import { IoLogoGithub } from "react-icons/io";
import "./Projects.css";

const Projects = () => {
  const [cards, setCards] = useState([]); 
  const [consoleMessages, setConsoleMessages] = useState([]); 

  const fetchData = async () => {
    try {
      const projectsRef = ref(database, 'cards'); 
      const snapshot = await get(projectsRef); 

      if (snapshot.exists()) {
        const data = snapshot.val();  

        const projectList = Object.keys(data).map(key => ({
          id: key,  
          coverName: data[key].cardCoverName || '',
          description: data[key].cardDescription || '',
          githubLink: data[key].cardGithubLink || '',
          tags: data[key].cardTags || [],
          title: data[key].cardTitle || '',
          backgroundImage: data[key].cardBackgroundImage || '', // Fetch the background image
        }));
        setCards(projectList);  

        setConsoleMessages(prev => [...prev, "Projects data fetched successfully"]);
      } else {
        setConsoleMessages(prev => [...prev, "No data available"]);  
      }
    } catch (error) {
      console.error("Error fetching data:", error); 
      setConsoleMessages(prev => [...prev, `Error fetching data: ${error.message}`]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);  

  return (
    <div className="ProjeContainer" id="projects">
      <h1>Projects</h1>
      <hr className="project-separator" />
      
      {consoleMessages.length > 0 && (
        <div className="console-output">
          <h3>Console Output:</h3>
          {consoleMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}

      <div className="card-container">
        {cards && cards.length > 0 ? (  
          cards.map((card, index) => (
            <div className="card" key={index}>
              <div 
                className="cardBackground" 
                style={{ backgroundImage: `url(${card.backgroundImage})` }}
              ></div>
              <div className="card-main">
                <h1 alt={`${card.title} Logo`}>{card.coverName}</h1>
              </div>
              <div className="card-hover" id="cardInfo">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="tags">
                  {card.tags && card.tags.length > 0 ? (
                    card.tags.map((tag, tagIndex) => (
                      <div className="tag" key={tagIndex}>
                        {tag}
                      </div>
                    ))
                  ) : (
                    <div>No tags available</div>
                  )}
                </div>
                <a href={card.githubLink} target="_blank" rel="noopener noreferrer">
                  <IoLogoGithub size={40} color="white" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </div>
  );
};

export default Projects;