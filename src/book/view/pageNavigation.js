import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
} from "../../components/Containers";
import { getSections, getSubSections } from "./utils";
import { LuFileWarning, LuFileEdit } from "react-icons/lu";
import { Link } from "react-router-dom";

export const PageNavigation = ({
  setState,
  setStatus,
  nodes101,
  state,
  book_id,
  isMobile,
}) => {
  const {
    page_id,
    activeSectionsByPageId,
    frontPage,
    allSectionsByPageId,
    allSubSectionsBySectionId,
  } = state;

  return (
    <>
      <ChapterNavContainer
        onClick={(e) => {
          e.stopPropagation();
          setState((prevState) => ({
            ...prevState,
            page_id: frontPage.uid,
            activeNode: frontPage,
            activeSubSectionsBySectionId: [],
          }));
        }}
        isActive={state.activeNode.uid === frontPage.uid}
      >
        {frontPage.title}
      </ChapterNavContainer>
      {nodes101.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer
              onClick={(e) => {
                e.stopPropagation();
                getSections(
                  chapter,
                  setState,
                  setStatus,
                  book_id,
                  allSectionsByPageId
                );
              }}
              isActive={state.activeNode.uid === chapter.uid}
            >
              <div className="page-nav-title">{chapter.title}</div>
              <div className="page-nav-icon">
                {page_id === chapter.uid ? (
                  <MdOutlineKeyboardArrowDown size={16} color="#2d2d2d" />
                ) : (
                  <MdOutlineKeyboardArrowRight size={16} color="#2d2d2d" />
                )}
              </div>
            </PageNavContainer>
            <SectionsNavContainer>
              {page_id === chapter.uid &&
                activeSectionsByPageId.map((section) => {
                  return (
                    <SectionNavContainer
                      key={section.uid}
                      onClick={(e) => {
                        e.stopPropagation();
                        getSubSections(
                          section,
                          setState,
                          setStatus,
                          book_id,
                          allSubSectionsBySectionId
                        );
                      }}
                      isActive={state.activeNode.uid === section.uid}
                    >
                      {section.title}
                    </SectionNavContainer>
                  );
                })}
            </SectionsNavContainer>
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
              <Link to={`/edit/book/${book_id}`} style={{ marginLeft: 5 }}>
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
