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

const Button = ({ onClick, title }) => {
  return (
    <div
      className="button-none"
      onClick={onClick}
      style={{ padding: "3px 0px" }}
    >
      {title}
    </div>
  );
};

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
        editNode: null,
        addNode: null,
        modal: "",
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
            editNode: null,
            addNode: null,
            modal: "",
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
        editNode: null,
        addNode: null,
        modal: "",
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
            editNode: null,
            addNode: null,
            modal: "",
          });
        });
    }
  };

  return (
    <>
      {/*
       * @ Left Navigation
       */}
      <div
        style={{
          width: "20%",
          paddingTop: 15,
          borderRight: "1px solid #ebebeb",
        }}
      >
        <ChapterNavContainer
          onClick={() => {
            setState({
              ...state,
              page_id: frontPage.uid,
              activeNode: frontPage,
              editNode: null,
              addNode: null,
              modal: "",
            });
          }}
        >
          {frontPage.title}
        </ChapterNavContainer>
        <Button
          onClick={() => {
            setState({
              ...state,
              topNode: frontPage,
              modal: "add_chapter",
            });
          }}
          title="Add Chapter"
        />

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
              <Button
                onClick={() => {
                  setState({
                    ...state,
                    topNode: chapter,
                    modal: "add_chapter",
                  });
                }}
                title="Add Chapter"
              />
              {/* Sections */}
              {page_id === chapter.uid && (
                <SectionsNavContainer>
                  <Button
                    title="Add Section"
                    onClick={() => {
                      setState({
                        ...state,
                        topNode: chapter,
                        modal: "add_section",
                      });
                    }}
                  />
                  {activeSectionsByPageId.map((section) => {
                    return (
                      <div key={section.uid}>
                        <SectionNavContainer
                          onClick={(e) => {
                            e.stopPropagation();
                            getSubSections(section);
                          }}
                        >
                          {section.title}
                        </SectionNavContainer>
                        <Button
                          title="Add Section"
                          onClick={(e) => {
                            setState({
                              ...state,
                              topNode: section,
                              modal: "add_section",
                            });
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    );
                  })}
                </SectionsNavContainer>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
