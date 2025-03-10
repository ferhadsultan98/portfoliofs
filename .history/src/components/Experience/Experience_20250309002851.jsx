import React, { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import FSLogo from "../../assets/FS Light.png"; // Varsayılan logo
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experiences() {
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
    <section className="experiences" id="experiences">
      <h2 className="experiences__title">Experience</h2>
      <div className="experiences__container">
        {experiences.map((experience) => (
          <div className="experience-card" key={experience.id}>
            <div className="experience-card__logo">
              <img
                src={experience.companyLogo || FSLogo} // Firebase'den logo gelmezse FSLogo kullanılır
                alt={`${experience.company} Logo`}
              />
            </div>
            <div className="experience-card__content">
              <h3 className="experience-card__company">{experience.company}</h3>
              <p className="experience-card__year">
                <LuCalendarDays /> {experience.year}
              </p>
              <p className="experience-card__location">
                <MdLocationOn /> {experience.location}
              </p>
              <p className="experience-card__description">{experience.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}