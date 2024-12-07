import React from "react";

const ButtonUI = ({ text, onClick, mode = "text", icon, variant = "outline", color, textColor, isDisable = false }) => {

  return (
    <button
      type="submit"
      className={`w-full bg-primary-red rounded-[10px] text-white-color text-sm font-semibold px-3 py-2 `}
      style={{
        backgroundColor: variant === "outline" ? "transparent" : color,
        border: `2px solid ${color}`,
        color: `${textColor}`
      }}
      disabled={isDisable}
      onClick={() => { onClick(); }}>
      {mode === "text" ? text : icon}
    </button>
  );
};

export default ButtonUI;
