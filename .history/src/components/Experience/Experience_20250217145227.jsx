import "./Experience.scss";
import PMSLogo from "../../assets/pmslogo.webp";
import { LuCalendarDays } from "react-icons/lu";

export default function Experience() {
  return (
    <div className="experiencesContainer" id="experience">
      <div className="experienceItem">
        <div className="experiencesLeftSide">
          <img src={PMSLogo} alt="CompanyLogo" />
        </div>
        <div className="experiencesRightSide">
          <div className="experiencesRightSideTopSection">
            <h2 className="company">PMS LLC </h2>
            <p className="year">
              <i><LuCalendarDays /></i>
              2024.05.12
            </p>
          </div>
          <hr style={{ margin: "15px 0" }} />
          <div className="experiencesRightSideBottomSection">
            <p className="location">Azerbaijan</p>
            <p className="description">I am Frontend developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
