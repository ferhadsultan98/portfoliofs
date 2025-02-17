import { useEffect, useState } from "react";
import { getdatabase, ref, get } from "../../../firebase/Firebase";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const experiencesRef = ref(database, "experiences"); // Path to your experiences data
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
        console.error(error);
      });
  }, []);

  return (
    <div className="experiencesContainer" id="experience">
      {experiences.map((experience) => (
        <div className="experienceItem" key={experience.id}>
          <div className="experiencesLeftSide">
            {/* Assuming the Cloudinary URL is stored under experience.companyLogo */}
            <img
              src={experience.companyLogo}
              alt={`${experience.company} Logo`}
              className="companyLogo"
            />
          </div>
          <div className="experiencesRightSide">
            <div className="experiencesRightSideTopSection">
              <h2 className="company">{experience.company}</h2>
              <p className="year">
                <LuCalendarDays />
                {experience.year}
              </p>
            </div>
            <hr style={{ margin: "15px 0" }} />
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
