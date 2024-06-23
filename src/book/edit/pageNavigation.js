import { orderNodes } from 'loony-utils';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { axiosInstance } from 'loony-query';

const Button = ({ onClick, title }) => {
  return (
    <div className='button-none' onClick={onClick}>
      {title}
    </div>
  );
};

const SectionsNavContainer = ({ children }) => {
  return <div style={{ paddingLeft: 20 }}>{children}</div>;
};

const PagesNavContainer = ({ children }) => {
  return <div>{children}</div>;
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
      });
    } else {
      axiosInstance
        .get(`/book/get_book_sections?book_id=${book_id}&page_id=${uid}`)
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
        .get(`/book/get_book_sub_sections?book_id=${book_id}&page_id=${uid}`)
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
      {/*
       * @ Left Navigation
       */}
      <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
        <div
          className='chapter-nav'
          onClick={() => {
            setState({
              ...state,
              page_id: frontPage.uid,
              activeNode: frontPage,
            });
          }}
        >
          {frontPage.title}
        </div>
        <Button
          onClick={() => {
            setState({
              ...state,
              topNode: frontPage,
              modal: 'add_chapter',
            });
          }}
          title='Add Chapter'
        />

        {nodes101.map((chapter) => {
          return (
            <div key={chapter.uid}>
              <PagesNavContainer>
                <div
                  className='chapter-nav'
                  onClick={(e) => {
                    e.stopPropagation();
                    getSections(chapter);
                  }}
                >
                  <div style={{ width: '90%' }}>{chapter.title}</div>
                  <div>
                    {page_id === chapter.uid ? (
                      <MdOutlineKeyboardArrowDown size={16} color='#2d2d2d' />
                    ) : (
                      <MdOutlineKeyboardArrowRight size={16} color='#2d2d2d' />
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setState({
                      ...state,
                      topNode: chapter,
                      modal: 'add_chapter',
                    });
                  }}
                  title='Add Chapter'
                />
              </PagesNavContainer>
              {/* Sections */}
              <SectionsNavContainer>
                {page_id === chapter.uid && (
                  <>
                    <Button
                      title='Add Section'
                      onClick={() => {
                        setState({
                          ...state,
                          topNode: chapter,
                          modal: 'add_section',
                        });
                      }}
                    />
                    {activeSectionsByPageId.map((section) => {
                      return (
                        <div key={section.uid}>
                          <div
                            className='section-nav cursor'
                            onClick={(e) => {
                              e.stopPropagation();
                              getSubSections(section);
                            }}
                          >
                            {section.title}
                          </div>
                          <Button
                            title='Add Section'
                            onClick={(e) => {
                              setState({
                                ...state,
                                topNode: section,
                                modal: 'add_section',
                              });
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </SectionsNavContainer>
            </div>
          );
        })}
      </div>
    </>
  );
};
