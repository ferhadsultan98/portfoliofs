import "./Experience.scss";
import { MdBusinessCenter } from "react-icons/md";

export default function Experience() {
  return (
    <div className="experiencesContainer" id="experience">
      <div className="experiencesLeftSide">
        <MdBusinessCenter color="white" fontSize="1.7rem" />
      </div>
      <div className="experiencesRightSide">
        <h1 className="company"></h1>
      </div>
    </div>
  );
}
