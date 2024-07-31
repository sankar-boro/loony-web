export const ChapterNavContainer = ({ children, onClick, isActive }) => {
  return (
    <div
      className={`chapter-nav ${isActive ? "active-nav" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const ButtonNavContainer = ({ children }) => {
  return <div className="chapter-nav">{children}</div>;
};

export const MenuNavContainer = ({ children, onClick, activeMenu, route }) => {
  return (
    <div
      className={`menu-nav p12 ${activeMenu}`}
      data-id={route}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const PageNavContainer = ChapterNavContainer;

export const SectionNavContainer = ({ children, onClick, isActive }) => {
  return (
    <div
      className={`section-nav ${isActive ? "active-nav" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const SectionsNavContainer = ({ children, onClick }) => {
  return (
    <div onClick={onClick} style={{ paddingLeft: "10%" }}>
      {children}
    </div>
  );
};
