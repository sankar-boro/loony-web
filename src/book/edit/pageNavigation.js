import { orderNodes } from 'loony-utils';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { axiosInstance } from 'loony-query';

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
        <div className='chapter-nav cursor'>
          <div
            className='chapter-nav'
            onClick={(e) => {
              e.stopPropagation();
              setState({
                ...state,
                page_id: frontPage.uid,
                activeNode: frontPage,
              });
            }}
          >
            {frontPage.title}
          </div>
        </div>
        <div
          className='button-none'
          onClick={(e) => {
            e.stopPropagation();
            setState({
              ...state,
              topNode: frontPage,
              modal: 'add_chapter',
            });
          }}
          style={{ marginRight: 16, paddingTop: 7, paddingBottom: 7 }}
        >
          Add Chapter
        </div>
        {nodes101.map((chapter) => {
          return (
            <div key={chapter.uid}>
              <div className='chapter-nav-con cursor' key={chapter.uid}>
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
                <div className='flex-row' style={{ paddingTop: 5, paddingBottom: 5 }}>
                  <div
                    className='button-none'
                    onClick={() => {
                      setState({
                        ...state,
                        topNode: chapter,
                        modal: 'add_chapter',
                      });
                    }}
                    style={{ marginRight: 16 }}
                  >
                    Add Chapter
                  </div>
                </div>
              </div>
              {/* Sections */}
              <div style={{ paddingLeft: 20 }}>
                {page_id === chapter.uid && (
                  <>
                    <div
                      className='button-none'
                      onClick={() => {
                        setState({
                          ...state,
                          topNode: chapter,
                          modal: 'add_section',
                        });
                      }}
                      style={{ paddingBottom: 5 }}
                    >
                      Add Section
                    </div>
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
                          <div
                            className='button-none'
                            style={{ paddingTop: 5, paddingBottom: 5 }}
                            onClick={(e) => {
                              setState({
                                ...state,
                                topNode: section,
                                modal: 'add_section',
                              });
                              e.stopPropagation();
                            }}
                          >
                            Add Section
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/*
       * @ Left Navigation End
       */}
    </>
  );
};
