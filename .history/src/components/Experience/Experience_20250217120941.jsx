import "./Experience.scss";
import { MdBusinessCenter } from "react-icons/md";

export default function Experience() {
  return (
    <div className="experiencesContainer" id="experience">
      <div className="experiencesLeftSide">
        <MdBusinessCenter color="white" fontSize="1.7rem" />
      </div>
      <div className="experiencesRightSide">
        <div className="experiencesRightSideTopSection">
        <h1 className="company">PMS LLC </h1>
        <p className="description">I am Frontend developer</p>
        <p className="location"></p>
        <p className="year"></p>
      </div>
    </div>
  );
}
