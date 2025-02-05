import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLocationArrow,
} from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import './About.css';

const AboutSection = () => {






  return (
    <div className="AboutSectionContainer" id="about" style={{paddingTop:  '80px'}}>
      <h1>About</h1>
      <hr className="about-separator" />
      <div className="about-container">
        <div className="about-card">
          <div className="about-content">
            <p>
              I’m an aspiring frontend developer born on June 15, 1998, in
              Agstafa, Azerbaijan. I hold a bachelor's and master's degree from
              Azerbaijan Technical University. I’m passionate about
              creating user-friendly interfaces using HTML, CSS, JavaScript, and
              frameworks like React. I look forward to connecting and
              collaborating on projects!
            </p>
            <div className="about-tags">
              <span className="tag">#Innovative</span>
              <span className="tag">#Developer</span>
              <span className="tag">#Designer</span>
              <span className="tag">#Frontend</span>
              <span className="tag">#UI/UX</span>
              <span className="tag">#JavaScript</span>
              <span className="tag">#ReactJS</span>
              <span className="tag">#CSS</span>
              <span className="tag">#ResponsiveDesign</span>
            </div>

            <div className="contact-info-container">
              <h2>Contact</h2>
              <div className="CommonContact">
                <a>
                  <p>
                    <i>
                      <FaLocationArrow size="1.2em" />
                    </i>
                    Baku, N.Narimanov 27
                  </p>
                </a>
                <a href="tel:+994555254193">
                  <p>
                    <i>
                      <IoIosCall size="1.6em" />
                    </i>
                    +994 (55) 525 4193
                  </p>
                </a>
                <a href="mailto:sultanoworks@gmail.com?subject=Hi Farhad Sultan">
                  <p>
                    <i>
                      <IoIosMail size="1.6em" />
                    </i>
                    sultanoworks@gmail.com
                  </p>
                </a>
              </div>
              <div className="ContactLinks">
                <ul className="SocialIcons">
                  <a
                    href="https://www.facebook.com/ferhad.sultann"
                    target="blank"
                  >
                    <li className="icon facebook">
                      <span className="iconname">Facebook</span>
                      <FaFacebookF size="1.6em" />
                    </li>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/farhadsultan98/"
                    target="blank"
                  >
                    <li className="icon linkedin">
                      <span className="iconname">Linkedin</span>
                      <FaLinkedinIn size="1.6em" />
                    </li>
                  </a>
                  <a
                    href="https://www.instagram.com/ferhad.sultann"
                    target="blank"
                  >
                    <li className="icon instagram">
                      <span className="iconname">Instagram</span>
                      <FaInstagram size="1.6em" />
                    </li>
                  </a>
                  <a href="https://github.com/ferhadsultan98" target="blank">
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
