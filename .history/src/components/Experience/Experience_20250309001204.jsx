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

  // Firebase'den veriyi çekme
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
          console.log("Fetched Experiences:", experienceList); // Veri kontrolü için log
          setExperiences(experienceList);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching experiences:", error);
      });
  }, []);

  // activeExperienceIndex'in sınırlar içinde olduğundan emin olma
  useEffect(() => {
    if (experiences.length > 0 && activeExperienceIndex >= experiences.length) {
      console.warn("Resetting activeExperienceIndex due to out of bounds");
      setActiveExperienceIndex(0);
    }
  }, [experiences, activeExperienceIndex]);

  // Mobil cihazlarda aktif tab'ın görünür olmasını sağlama
  useEffect(() => {
    const activeTab = document.querySelector(".experience-tab.active");
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }, [activeExperienceIndex]);

  // Tab değiştirme fonksiyonu
  const handleTabClick = (index) => {
    console.log("Switching to index:", index); // Tab değişimi kontrolü için log
    setActiveExperienceIndex(index);
  };

  // Güvenli şekilde aktif deneyimi seçme
  const activeExperience = experiences.length > 0 ? experiences[activeExperienceIndex] : {};

  return (
    <section className="work-experience" id="experiences">
      <h2 className="section-title">Experience</h2>

      {experiences.length > 0 ? (
        <div className="experience-container">
          <div className="experience-tabs">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`experience-tab ${
                  index === activeExperienceIndex ? "active" : ""
                }`}
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

                {activeExperience.achievements &&
                  activeExperience.achievements.length > 0 && (
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