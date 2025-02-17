import { useEffect, useState } from "react";
import { database,ref, get  } from "../../firebase/Firebase"; // Import your firebase config
import PMSLogo from "../../assets/pmslogo.webp"; // You may update this to dynamically use logo URL from Firebase
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase database
    const experiencesRef = ref(database, "experiences");
    get(experiencesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const experienceList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setExperiences(experienceList); // Set the fetched experiences
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching experiences:", error);
      });
  }, []);

  return (
    <div className="experiencesContainer" id="experience">
      {experiences.map((experience) => (
        <div className="experienceItem" key={experience.id}>
          <div className="experiencesLeftSide">
            <img src={experience.companyLogo || PMSLogo} alt="CompanyLogo" />
          </div>
          <div className="experiencesRightSide">
            <div className="experiencesRightSideTopSection">
              <h2 className="company">{experience.company}</h2>
              <p className="year">
                <LuCalendarDays />
                {experience.year}
              </p>
            </div>
            <hr style={{ margin: "15px 0", color }} />
            <div className="experiencesRightSideBottomSection">
              <p className="location">
                <MdLocationOn />
                {experience.location}
              </p>
              <p className="description">{experience.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
