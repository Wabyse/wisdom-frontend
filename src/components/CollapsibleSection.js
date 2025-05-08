import { useState, useRef } from "react";

const CollapsibleSection = ({ title, language, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className="w-[80%] m-[10px] border border-[#ddd] rounded-lg overflow-hidden">
      <button
        type="button"
        className={`collapsible-header-en w-full text-white p-[10px] border-none cursor-pointer flex bg-gray-500 text-[16px] text-left ${language ? "items-start" : "items-end justify-end"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {language ? (
          <>
            <span className={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}>&#9660;</span>
            {title}
          </>
        ) : (
          <>
            {title}
            <span className={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}>&#9660;</span>
          </>
        )}
      </button>
      <div
        className={`max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-in-out bg-[#f9f9f9] px-[10px] flex ${language ? "justify-start" : "justify-end"}`}
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
