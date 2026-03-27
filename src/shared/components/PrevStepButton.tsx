import React from "react";

interface PrevStepButtonProps {
  onClick?: () => void;
}

const PrevStepButton: React.FC<PrevStepButtonProps> = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className="prev-step-btn bg-theme-rich-black/10 text-theme-rich-black font-medium py-2 px-6 rounded-lg hover:bg-theme-rich-black/20 transition-colors duration-200">
        Anterior
    </button>
  );
}

export default PrevStepButton;