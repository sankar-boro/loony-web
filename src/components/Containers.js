export const ChapterNavContainer = ({ children, onClick }) => {
  return (
    <div className='chapter-nav' onClick={onClick}>
      {children}
    </div>
  );
};

export const MenuNavContainer = ({ children, onClick, activeMenu }) => {
  return (
    <div className={`menu-nav p12 ${activeMenu}`} onClick={onClick}>
      {children}
    </div>
  );
};

export const PageNavContainer = ChapterNavContainer;

export const SectionNavContainer = ({ children, onClick }) => {
  return (
    <div className='section-nav' onClick={onClick}>
      {children}
    </div>
  );
};

export const SectionsNavContainer = ({ children, onClick }) => {
  return (
    <div onClick={onClick} style={{ paddingLeft: 20 }}>
      {children}
    </div>
  );
};
