/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import FSLogo from "../../assets/FS Light.png";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

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
    <section className="experiences-section" id="experiences">
      <div className="container">
        <h1 className="section-title">Experience</h1>
        <hr className="experience-separator" />
        
        {experiences.length > 0 && (
          <div className="experiences-container">
            <div className="experiences-tabs">
              {experiences.map((exp, index) => (
                <div 
                  key={exp.id}
                  className={`tab ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  <div className="tab-logo">
                    <img src={exp.companyLogo || FSLogo} alt={`${exp.company} Logo`} />
                  </div>
                  <div className="tab-info">
                    <h3>{exp.company}</h3>
                    <p className="year">
                      <LuCalendarDays className="icon" />
                      {exp.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {experiences.length > activeTab && (
              <div className="experiences-content">
                <div className="experience-header">
                  <h2 className="company">{experiences[activeTab].company}</h2>
                  <div className="meta-info">
                    <span className="year">
                      <LuCalendarDays className="icon" />
                      {experiences[activeTab].year}
                    </span>
                    <span className="location">
                      <MdLocationOn className="icon" />
                      {experiences[activeTab].location}
                    </span>
                  </div>
                </div>
                
                <div className="experience-body">
                  <p className="description">{experiences[activeTab].description}</p>
                  
                  {experiences[activeTab].skills && (
                    <div className="skills">
                      {experiences[activeTab].skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {experiences.length === 0 && (
          <div className="loading-experiences">
            <p>Loading experiences...</p>
          </div>
        )}
      </div>
    </section>
  );
}