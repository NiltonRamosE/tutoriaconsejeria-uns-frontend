import React from 'react';

interface ItemSidebarProps {
  href: string;
  section: string;
  title: string;
  description: string;
  iconSrc: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ItemSidebar: React.FC<ItemSidebarProps> = ({
  href,
  section,
  title,
  description,
  iconSrc,
  isActive = false,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  // Clases base
  const baseClasses = "block p-4 rounded-xl transition-all duration-300 border group";
  
  // Clases condicionales según si está activo
  const activeClasses = isActive 
    ? "bg-theme-keppel/10 border-theme-keppel" 
    : "border-theme-rich-black/20 hover:bg-theme-keppel/5";

  // Clases para el ícono (también cambia cuando está activo)
  const iconContainerClasses = `mr-4 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
    isActive 
      ? "bg-theme-keppel/30" 
      : "bg-theme-keppel/20 group-hover:bg-theme-keppel/30"
  }`;

  return (
    <a
      href={href}
      data-section={section}
      onClick={handleClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      <div className="flex items-center">
        <div className={iconContainerClasses}>
          <img src={iconSrc} alt={title} className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default ItemSidebar;