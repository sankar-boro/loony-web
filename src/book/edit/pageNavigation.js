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
import { getSections, getSubSections } from "./utils";

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
          isActive={state.activeNode.uid === frontPage.uid}
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
                  getSections(chapter, setState, allSectionsByPageId, book_id);
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
                            getSubSections(
                              section,
                              setState,
                              allSubSectionsBySectionId,
                              book_id
                            );
                          }}
                          isActive={state.activeNode.uid === section.uid}
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
