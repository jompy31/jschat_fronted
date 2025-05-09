import React from "react";
import { useMediaQuery } from 'react-responsive';
import Accordion from "./faq/Accordion";
import illustration__box from "./images/illustration-box-desktop.svg";
import illustration__woman_desktop from "./images/illustration-woman-online-desktop.svg";
import illustration__woman_mobile from "./images/illustration-woman-online-mobile.svg";
import faqData from "./faqData.json";
import "./faq/faq.css";

const Faq = ({ isModal = false }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 700px)' });

  return (
    <div className="container" style={{ marginTop: isModal ? "0" : "5%" }}>
      <div className="component">
        <div className="illustration">
          {!isMobile ? (
            <>
              <img
                src={illustration__box}
                alt="illustration with box"
                className="illustration__box" loading="lazy"
              />
              <img
                className="illustration__woman-desktop"
                src={illustration__woman_desktop}
                alt="illustration with woman" loading="lazy"
              />
            </>
          ) : (
            <img
              className="illustration__woman-mobile"
              src={illustration__woman_mobile}
              alt="illustration with woman" loading="lazy"
            />
          )}
        </div>
        <Accordion questionsAnswers={faqData} />
      </div>
    </div>
  );
};

export default Faq;