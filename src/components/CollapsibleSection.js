import { useState, useRef } from "react";
import "../styles/CollapsibleSection.css";

const CollapsibleSection = ({ title, language, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className="collapsible-container">
      <button
        type="button"
        className={language ? "collapsible-header-en" : "collapsible-header-ar"}
        onClick={() => setIsOpen(!isOpen)}
      >
        {language ? (
          <>
            <span className={`arrow ${isOpen ? "open" : ""}`}>&#9660;</span>
            {title}
          </>
        ) : (
          <>
            {title}
            <span className={`arrow ${isOpen ? "open" : ""}`}>&#9660;</span>
          </>
        )}
      </button>
      <div
        className={
          language ? "collapsible-content-en" : "collapsible-content-ar"
        }
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}0px` : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
