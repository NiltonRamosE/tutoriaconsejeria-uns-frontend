import React from 'react';

interface ItemSidebarProps {
  href: string;
  section: string;
  title: string;
  description: string;
  iconSrc: string;
}

const ItemSidebar: React.FC<ItemSidebarProps> = ({
  href,
  section,
  title,
  description,
  iconSrc
}) => {
  return (
    <a
      href={href}
      data-section={section}
      className="block p-4 rounded-xl transition-all duration-300 border group"
    >
      <div className="flex items-center">
        <div className="mr-4 w-10 h-10 bg-theme-keppel/20 rounded-xl flex items-center justify-center group-hover:bg-theme-keppel/30 transition-colors duration-300">
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