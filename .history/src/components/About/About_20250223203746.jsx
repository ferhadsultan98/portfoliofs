import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLocationArrow,
} from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { database, ref, get } from "../../firebase/Firebase"; 
import './About.css';


const AboutSection = () => {

  const [aboutData, setAboutData] = useState({
    header: "",
    description: "",
    contact: {
      address: "",
      phone: "",
      email: "",
    },
    socialLinks: {
      facebook: "",
      github: "",
      instagram: "",
      linkedin: "",
    },
    tags: []
  });


  useEffect(() => {
    const fetchAboutData = async () => {
      const dbRef = ref(database, "about"); 
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setAboutData(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="AboutSectionContainer" id="about" >
      <h1>{aboutData.header}</h1>
      <hr className="about-separator" />
      <div className="about-container" >
        <div className="about-card">
          <div className="about-content">
            <p>
              {aboutData.description || "Loading description..."}
            </p>
            <div className="about-tags">
              {aboutData.tags.length > 0 ? (
                aboutData.tags.map((tag, index) => (
                  <span className="tag" key={index}>
                    #{tag}
                  </span>
                ))
              ) : (
                <span>Loading tags...</span>
              )}
            </div>

            <div className="contact-info-container">
              <h2>Contact</h2>
              <div className="CommonContact">
                <a>
                  <p>
                    <i>
                      <FaLocationArrow size="1.2em" />
                    </i>
                    {aboutData.contact.address || "Loading address..."}
                  </p>
                </a>
                <a href={`tel:${aboutData.contact.phone}`}>
                  <p>
                    <i>
                      <IoIosCall size="1.6em" />
                    </i>
                    {aboutData.contact.phone || "Loading phone..."}
                  </p>
                </a>
                <a href={`mailto:${aboutData.contact.email}?subject=Hi Farhad Sultan`}>
                  <p>
                    <i>
                      <IoIosMail size="1.6em" />
                    </i>
                    {aboutData.contact.email || "Loading email..."}
                  </p>
                </a>
              </div>
              <div className="ContactLinks">
                <ul className="SocialIcons">
                  <a href={aboutData.socialLinks.facebook} target="blank">
                    <li className="icon facebook">
                      <span className="iconname">Facebook</span>
                      <FaFacebookF size="1.6em" />
                    </li>
                  </a>
                  <a href={aboutData.socialLinks.linkedin} target="blank">
                    <li className="icon linkedin">
                      <span className="iconname">Linkedin</span>
                      <FaLinkedinIn size="1.6em" />
                    </li>
                  </a>
                  <a href={aboutData.socialLinks.instagram} target="blank">
                    <li className="icon instagram">
                      <span className="iconname">Instagram</span>
                      <FaInstagram size="1.6em" />
                    </li>
                  </a>
                  <a href={aboutData.socialLinks.github} target="blank">
                    <li className="icon github">
                      <span className="iconname">Github</span>
                      <FaGithub size="1.6em" />
                    </li>
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
