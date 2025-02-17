import "./Experience.scss";
import { MdBusinessCenter } from "react-icons/md";

export default function Experience() {
  return (
    <div className="experiencesContainer" id="experience">
      <div className="experiencesLeftSide">
        <i></i><MdBusinessCenter color="white" fontSize="1.7rem" />
      </div>
      <div className="experiencesRightSide">
        <div className="experiencesRightSideTopSection">
        <h1 className="company">PMS LLC </h1>
        <p className="year">2024.05.12</p>
        <hr />
        </div>
        <div className="experiencesRightSideBottomSection">
        <p className="location">Azerbaijan</p>
        <p className="description">I am Frontend developer</p>
        </div>
      </div>
    </div>
  );
}
