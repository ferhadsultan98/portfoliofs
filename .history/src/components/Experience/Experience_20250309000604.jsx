/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import FSLogo from "../../assets/FS Light.png";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [activeExperience, setActiveExperience] = useState(0);

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

  return (
    <section className="work-experience" id="experiences">
      <h2 className="section-title">Experience</h2>
      
      {experiences.length > 0 && (
        <div className="experience-container">
          <div className="experience-tabs">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id} 
                className={`experience-tab ${index === activeExperience ? 'active' : ''}`}
                onClick={() => setActiveExperience(index)}
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
            {experiences[activeExperience] && (
              <div className="experience-details">
                <div className="experience-header">
                  <h3>{experiences[activeExperience].company}</h3>
                  <div className="experience-meta">
                    <span className="year">
                      <LuCalendarDays />
                      {experiences[activeExperience].year}
                    </span>
                    <span className="location">
                      <MdLocationOn />
                      {experiences[activeExperience].location}
                    </span>
                  </div>
                </div>
                
                <p className="experience-description">
                  {experiences[activeExperience].description}
                </p>
                
                {experiences[activeExperience].skills && (
                  <div className="skills-container">
                    <h4>Skills & Technologies</h4>
                    <div className="skills-list">
                      {experiences[activeExperience].skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {experiences[activeExperience].achievements && (
                  <div className="achievements-container">
                    <h4>Achievements</h4>
                    <ul className="achievements-list">
                      {experiences[activeExperience].achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}