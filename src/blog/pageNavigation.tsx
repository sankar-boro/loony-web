import { BasicMenuNavContainer } from "../components/Containers.tsx";
import { LuFileWarning, LuFileEdit } from "react-icons/lu";
import { Link } from "react-router-dom";
import { EditState, ReadState } from "types/index.ts";

export const PageNavigationEdit = ({ state, isMobile, blog_id }: {
  state: EditState | ReadState,
  isMobile: boolean,
  blog_id: number,
}) => {
  const { blogNodes } = state;

  return (
    <>
      {blogNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <BasicMenuNavContainer>
              <div className="page-nav-title">{chapter.title}</div>
            </BasicMenuNavContainer>
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
            <li>
              <LuFileEdit color="#2d2d2d" size={16} />
              <Link to={`/edit/blog/${blog_id}`}>Edit this page</Link>
            </li>
            <li>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to="#">Report</Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export const PageNavigationView = ({ state, isMobile, blog_id }: {
  state: EditState,
  isMobile: boolean,
  blog_id: number,
}) => {
  const { blogNodes } = state;

  return (
    <>
      {blogNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <BasicMenuNavContainer>
              <div className="page-nav-title">{chapter.title}</div>
            </BasicMenuNavContainer>
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
            <li>
              <LuFileEdit color="#2d2d2d" size={16} />
              <Link to={`/view/blog/${blog_id}`}>Read Blog</Link>
            </li>
            <li>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to="">Report</Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};
