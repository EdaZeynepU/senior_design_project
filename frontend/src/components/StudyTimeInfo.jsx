import React, { useState } from "react";
import PropTypes from "prop-types";

const StudyTimeInfo = ({ isOpen, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((prev) => !prev)} className={`info-icon ${open && "red-bg"}`}>
        {open? "X": "!"}
      </button>
      <div className={open || isOpen ? "modal-bg" : "hidden"}>
        <div className="modal">{children}</div>
      </div>
    </div>
  );
};

StudyTimeInfo.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.element,
};

export default StudyTimeInfo;
