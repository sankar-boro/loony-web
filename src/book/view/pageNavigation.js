import { orderNodes } from "loony-utils";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { axiosInstance } from "loony-query";
import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
} from "../../components/Containers";

export const PageNavigation = ({ setState, nodes101, state, book_id }) => {
  const {
    page_id,
    activeSectionsByPageId,
    frontPage,
    allSectionsByPageId,
    allSubSectionsBySectionId,
  } = state;

  const getSections = (__node) => {
    const { uid } = __node;
    if (allSectionsByPageId[uid]) {
      setState({
        ...state,
        activeSectionsByPageId: allSectionsByPageId[uid],
        page_id: __node.uid,
        activeNode: __node,
        activeSubSectionsBySectionId: [],
      });
    } else {
      axiosInstance
        .get(`/book/get/sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, __node);
          setState({
            ...state,
            activeSectionsByPageId: res,
            allSectionsByPageId: {
              ...allSectionsByPageId,
              [uid]: res,
            },
            page_id: __node.uid,
            activeNode: __node,
            activeSubSectionsBySectionId: [],
          });
        });
    }
  };

  const getSubSections = (__node) => {
    const { uid } = __node;
    if (allSubSectionsBySectionId[uid]) {
      setState({
        ...state,
        activeSubSectionsBySectionId: allSubSectionsBySectionId[uid],
        section_id: __node.uid,
        activeNode: __node,
      });
    } else {
      axiosInstance
        .get(`/book/get/sub_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, __node);
          setState({
            ...state,
            activeSubSectionsBySectionId: res,
            allSubSectionsBySectionId: {
              ...allSubSectionsBySectionId,
              [uid]: res,
            },
            section_id: __node.uid,
            activeNode: __node,
          });
        });
    }
  };
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
      >
        {frontPage.title}
      </ChapterNavContainer>
      {nodes101.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer
              onClick={(e) => {
                e.stopPropagation();
                getSections(chapter);
              }}
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
                        getSubSections(section);
                      }}
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
