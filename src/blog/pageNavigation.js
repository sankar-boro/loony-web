export const PageNavigation = ({ state }) => {
  const { blogNodes } = state;

  return (
    <div
      style={{
        width: "15%",
        paddingTop: 15,
        borderRight: "1px solid #ebebeb",
      }}
    >
      {blogNodes.map((chapter) => {
        return (
          <div className="chapter-nav-con cursor" key={chapter.uid}>
            <div
              className="chapter-nav"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {chapter.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};
