import { PageNavContainer } from "../components/Containers";
import { LuFileWarning, LuFileEdit } from "react-icons/lu";
import { Link } from "react-router-dom";

export const PageNavigationEdit = ({ state, isMobile, blog_id }) => {
  const { blogNodes } = state;

  return (
    <>
      {blogNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer>
              <div className="page-nav-title">{chapter.title}</div>
            </PageNavContainer>
          </div>
        );
      })}
      {isMobile ? (
        <div
          style={{ marginTop: 20, borderTop: "1px solid #ccc", paddingTop: 12 }}
        >
          <ul
            className="list-item"
            style={{ paddingLeft: 0, listStyle: "none" }}
          >
            <li style={{ display: "flex", alignItems: "center" }}>
              <LuFileEdit color="#2d2d2d" size={16} />
              <Link to={`/edit/blog/${blog_id}`} style={{ marginLeft: 5 }}>
                Edit this page
              </Link>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <span style={{ marginLeft: 5 }}>Report</span>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export const PageNavigationView = ({ state, isMobile, blog_id }) => {
  const { blogNodes } = state;

  return (
    <>
      {blogNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer>
              <div className="page-nav-title">{chapter.title}</div>
            </PageNavContainer>
          </div>
        );
      })}
      {isMobile ? (
        <div
          style={{ marginTop: 20, borderTop: "1px solid #ccc", paddingTop: 12 }}
        >
          <ul
            className="list-item"
            style={{ paddingLeft: 0, listStyle: "none" }}
          >
            <li style={{ display: "flex", alignItems: "center" }}>
              <LuFileEdit color="#2d2d2d" size={16} />
              <Link to={`/view/blog/${blog_id}`} style={{ marginLeft: 5 }}>
                Read Blog
              </Link>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <span style={{ marginLeft: 5 }}>Report</span>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};
