import React from "react";

interface NextStepButtonProps {
  onClick?: () => void;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className="next-step-btn bg-theme-keppel text-white font-medium py-2 px-6 rounded-lg hover:bg-theme-keppel-dark transition-colors duration-200">
        Siguiente
    </button>
  );
}

export default NextStepButton;
