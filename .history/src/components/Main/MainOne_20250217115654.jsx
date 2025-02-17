import  { useRef, useState, useEffect } from "react";
import "./MainOne.css";
import { FaRegHandPeace } from "react-icons/fa6";
import FarhaddJPG from "../../assets/ProfileImage.jpeg";
import Projects from "../Projects/Projects";
import AboutSection from "../About/About";
import backGround from "../../assets/backGround.webp";

const MainOne = () => {
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);
  const [frontendText, setFrontendText] = useState("Frontend");

  useEffect(() => {
    const words = ["Frontend", "Web"];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentWord = words[index];
      if (!isDeleting && charIndex < currentWord.length) {
        setFrontendText(currentWord.substring(0, charIndex + 1));
        charIndex++;
      } else if (isDeleting && charIndex > 0) {
        setFrontendText(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else if (charIndex === currentWord.length && !isDeleting) {
        setTimeout(() => (isDeleting = true), 500);
      } else if (charIndex === 0 && isDeleting) {
        isDeleting = false;
        index = (index + 1) % words.length;
      }
    };

    const intervalId = setInterval(typeEffect, 200);

    return () => clearInterval(intervalId);
  }, []);

  const scrollToProjects = () => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const hrefHandler = (e) => {
    e.preventDefault()
    window.open("https://drive.usercontent.google.com/u/0/uc?id=1gSe7ubc4RmjlAA47F6RfIQUsCvlAkHdn&export=download", "_blank");
  };
  
  return (
    <div className="CommonMenu" id="home">
      <img src={backGround} alt="backGroundIMG" className="backGround" />
      <div className="MainOne">
        <div className="left">
          <div className="hi">
            <h1>Hi, I am Farhad!</h1>
            <FaRegHandPeace style={{ color: "#5A1D60", fontSize: "35px" }} />
          </div>
          <div className="frontend">
            <div className="up">
              <h1>{frontendText}</h1>
            </div>
            <h1 id="devOps">Developer</h1>
          </div>
          <div className="info">
            <p>
              I am a Frontend developer based in Azerbaijan, I'll help you build
              beautiful websites your users will love.
            </p>
          </div>
          <div className="buttons">
              <button className="downloadButton" onClick={hrefHandler}> 
                <span className="downloadbutton__text">Download CV</span>
              </button>
            <button className="ProjectButtonn" onClick={scrollToProjects}>
              <span className="ProjectButtonn-content">Projects</span>
            </button>
          </div>
        </div>
        <div className="right">
          <div className="myphoto">
            <img src={FarhaddJPG} alt="" />
          </div>
        </div>
      </div>
      <div className="ProjectsSection" ref={projectsRef}>
        <Projects />
      </div>
      <div className="AboutSection" ref={aboutRef}>
        <AboutSection />
      </div>
    </div>
  );
};

export default MainOne;
