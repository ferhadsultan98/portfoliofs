/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import FSLogo from "../../assets/FS Light.png";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);

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
        console.error("Error fetching experiences:", error);
      });
  }, []);

  // Ensure activeExperienceIndex is valid when experiences change
  useEffect(() => {
    if (experiences.length > 0 && activeExperienceIndex >= experiences.length) {
      setActiveExperienceIndex(0);
    }
  }, [experiences, activeExperienceIndex]);

  const handleTabClick = (index) => {
    setActiveExperienceIndex(index);
  };

  // Safety check to avoid rendering issues
  const activeExperience = experiences[activeExperienceIndex] || {};

  return (
    <section className="work-experience" id="experiences">
      <h2 className="section-title">Experience</h2>
      
      {experiences.length > 0 ? (
        <div className="experience-container">
          <div className="experience-tabs">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id} 
                className={`experience-tab ${index === activeExperienceIndex ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                <div className="tab-logo">
                  <img src={exp.companyLogo || FSLogo} alt={`${exp.company} Logo`} />
                </div>
                <h3>{exp.company}</h3>
                <p className="year">
                  <LuCalendarDays />
                  {exp.year}
                </p>
              </div>
            ))}
          </div>
          
          <div className="experience-content">
            {experiences.length > 0 && (
              <div className="experience-details">
                <div className="experience-header">
                  <h3>{activeExperience.company}</h3>
                  <div className="experience-meta">
                    <span className="year">
                      <LuCalendarDays />
                      {activeExperience.year}
                    </span>
                    <span className="location">
                      <MdLocationOn />
                      {activeExperience.location}
                    </span>
                  </div>
                </div>
                
                <p className="experience-description">
                  {activeExperience.description}
                </p>
                
                {activeExperience.skills && activeExperience.skills.length > 0 && (
                  <div className="skills-container">
                    <h4>Skills & Technologies</h4>
                    <div className="skills-list">
                      {activeExperience.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeExperience.achievements && activeExperience.achievements.length > 0 && (
                  <div className="achievements-container">
                    <h4>Achievements</h4>
                    <ul className="achievements-list">
                      {activeExperience.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="loading-container">Loading experiences...</div>
      )}
    </section>
  );
}