import React from "react";

const Spinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <p className="text-slate-500">{text}</p>
  </div>
);

export default Spinner;
