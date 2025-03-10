/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import FSLogo from "../../assets/FS Light.png";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);

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
          // Sort experiences by year (newest first)
          experienceList.sort((a, b) => {
            // Extract years from year strings (e.g., "2019 - 2022" -> 2022)
            const getEndYear = (yearString) => {
              const match = yearString.match(/\d{4}(?!\s*-)/);
              return match ? parseInt(match[0]) : 0;
            };
            return getEndYear(b.year) - getEndYear(a.year);
          });
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
        
        {experiences.length > 0 ? (
          <div className="timeline-container">
            <div className="timeline-line">
              {experiences.map((_, index) => (
                <div key={index} className="timeline-dot"></div>
              ))}
            </div>
            
            <div className="experience-cards">
              {experiences.map((experience, index) => (
                <div className="experience-card" key={experience.id}>
                  <div className="card-header">
                    <div className="logo-container">
                      <img src={experience.companyLogo || FSLogo} alt={`${experience.company} Logo`} />
                    </div>
                    <div className="title-container">
                      <h2 className="company">{experience.company}</h2>
                      <div className="meta-info">
                        <span className="year">
                          <LuCalendarDays className="icon" />
                          {experience.year}
                        </span>
                        <span className="location">
                          <MdLocationOn className="icon" />
                          {experience.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <p className="description">{experience.description}</p>
                    
                    {experience.skills && (
                      <div className="skills">
                        {experience.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="loading-experiences">
            <p>Loading experiences...</p>
          </div>
        )}
      </div>
    </section>
  );
}