import { useRef, useState, useEffect } from "react";
import "./MainOne.css";
import { FaRegHandPeace } from "react-icons/fa6";
import FarhaddJPG from "../../assets/ProfileImage.jpeg";
import Projects from "../Projects/Projects";
import AboutSection from "../About/About";
import backGround from "../../assets/backGround.webp";
import Experience from "../Experience/Experience";
import { motion, AnimatePresence } from "framer-motion"; // Animasyon için
import { Document, Page, pdfjs } from "react-pdf"; // PDF için
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// PDF worker'ı ayarla
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const MainOne = () => {
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const [frontendText, setFrontendText] = useState("Frontend");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [numPages, setNumPages] = useState(null); // PDF sayfa sayısı
  const [pageNumber, setPageNumber] = useState(1); // Şu anki sayfa

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPageNumber(1); // Modalı kapatırken sayfa numarasını sıfırla
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
            <button className="downloadButton" onClick={handleOpenModal}>
              <span className="downloadbutton__text">View CV</span>
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
      <div className="ExperienceSection" ref={experienceRef}>
        <Experience />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="modal-close-button" onClick={handleCloseModal}>
                ×
              </button>
              <div className="pdf-container">
                <Document
                  file="https://drive.usercontent.google.com/u/0/uc?id=1gSe7ubc4RmjlAA47F6RfIQUsCvlAkHdn&export=download" // PDF dosyanızın URL'si
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} width={600} />
                </Document>
                <div className="pdf-controls">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    Previous
                  </button>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainOne;