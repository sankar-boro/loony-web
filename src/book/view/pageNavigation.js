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

export const PageNavigation = ({
  setState,
  setStatus,
  nodes101,
  state,
  book_id,
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
              <div style={{ width: "90%" }}>{chapter.title}</div>
              <div>
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
    </>
  );
};
