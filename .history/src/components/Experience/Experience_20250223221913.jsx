import { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import FSLogo from "../../assets/FS Light.png";
import { LuCalendarDays } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import "./Experience.scss";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);

  // Sayfa kaydırma işlevi
  const handleMenuClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Header'ı görünür yapmak için 80px'lik boşluk bırakıyoruz
        behavior: "smooth",
      });
    }
  };

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
    <div className="experiencesContainer" id="experiences">
      <h1>Experience</h1>
      <hr className="experience-separator" />
      
      {/* Menü Ögeleri */}
      <div className="menu">
        <button onClick={() => handleMenuClick('experiences')}>Go to Experiences</button>
        {/* Diğer menü öğeleri de buraya eklenebilir */}
      </div>

      {experiences.map((experience) => (
        <div className="experienceItem" key={experience.id}>
          <div className="experiencesLeftSide">
            {<img src={experience.companyLogo || FSLogo} alt="CompanyLogo" />}
          </div>
          <div className="experiencesRightSide">
            <div className="experiencesRightSideTopSection">
              <h2 className="company">{experience.company}</h2>
              <p className="year">
                <LuCalendarDays />
                {experience.year}
              </p>
            </div>
            <hr style={{ margin: "15px 0", borderColor: "#cccccc62" }} />
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
