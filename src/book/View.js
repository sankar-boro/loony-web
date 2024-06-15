import { useState, useEffect } from 'react';
import { LuFileEdit } from 'react-icons/lu';
import { LuFileWarning } from 'react-icons/lu';
import { extractImage, orderBookNodes, orderNodes } from 'loony-utils';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../utils/query';
import PageLoader from '../components/PageLoader';

const View = ({ mobileNavOpen, setMobileNavOpen, isMobile }) => {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);

  const [state, setState] = useState({
    activeNode: null,
    page_id: null,
    section_id: null,
    activeSectionsByPageId: [],
    allSectionsByPageId: {},
    activeSubSectionsBySectionId: [],
    allSubSectionsBySectionId: {},
    nodes101: [],
    frontPage: null,
  });
  const { activeNode, nodes101, frontPage, activeSubSectionsBySectionId } = state;

  const getChapters = () => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
      const bookTree = orderBookNodes(data.data);
      const __frontPage = bookTree && bookTree[0];
      const __nodes101 = bookTree.slice(1);
      setState({
        ...state,
        frontPage: __frontPage,
        activeNode: __frontPage,
        nodes101: __nodes101,
        page_id: __frontPage.uid,
      });
    });
  };

  useEffect(() => {
    if (book_id) {
      getChapters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book_id]);

  if (!activeNode) return null;
  if (!nodes101) return null;
  const image = extractImage(activeNode.images);

  if (!frontPage)
    return (
      <div className='book-container'>
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }} />
          <div
            style={{
              width: '100%',
              paddingTop: 15,
              paddingLeft: '5%',
              background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
              paddingBottom: 50,
            }}
          >
            <PageLoader key_id={1} />
          </div>
        </div>
      </div>
    );

  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {/*
         * @ Left Navigation
         */}
        {isMobile && mobileNavOpen ? (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgb(0,0,0,0.5)',
              zIndex: 10,
              height: '105vh',
            }}
            onClick={() => {
              setMobileNavOpen(false);
            }}
          >
            <div
              style={{
                width: 320,
                backgroundColor: 'white',
                maxWidth: '100%',
                height: '100%',
                position: 'relative',
                padding: 12,
              }}
            >
              <Navigation setState={setState} nodes101={nodes101} state={state} book_id={book_id} />
            </div>
            {isMobile ? <EditContainerMobile node={activeNode} book_id={book_id} /> : null}
          </div>
        ) : null}
        {!isMobile ? (
          <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
            <Navigation setState={setState} nodes101={nodes101} state={state} book_id={book_id} />
          </div>
        ) : null}
        {/*
         * @ Left Navigation End
         */}

        {/*
         * @Page
         */}
        <div
          style={{
            width: isMobile ? '90%' : '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
            paddingBottom: 50,
            height: '100%',
          }}
        >
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <div className='page-heading'>{activeNode.title}</div>
            {image && image.name ? (
              <div style={{ width: '100%', borderRadius: 5 }}>
                <img
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${image.name}`}
                  alt=''
                  width='100%'
                />
              </div>
            ) : null}
            <MarkdownPreview
              source={activeNode.body}
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          </div>
          {activeSubSectionsBySectionId.map((book_node) => {
            const nodeImage = extractImage(book_node.images);
            return (
              <div className='page-section' key={book_node.uid}>
                <div className='section-title'>{book_node.title}</div>
                {nodeImage && nodeImage.name ? (
                  <div style={{ width: '100%', borderRadius: 5 }}>
                    <img
                      src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${nodeImage.name}`}
                      alt=''
                      width='100%'
                    />
                  </div>
                ) : null}
                <MarkdownPreview
                  source={book_node.body}
                  wrapperElement={{ 'data-color-mode': 'light' }}
                />
              </div>
            );
          })}
          <div style={{ height: 50 }} />
        </div>
        {/*
         * @Page End
         */}
        {!isMobile ? <RightBookContainer node={activeNode} book_id={book_id} /> : null}
      </div>
    </div>
  );
};

const Navigation = ({ setState, nodes101, state, book_id }) => {
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
      <div className='chapter-nav-con'>
        <div
          className='chapter-nav'
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
        </div>
      </div>
      {nodes101.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <div className='chapter-nav-con'>
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
            </div>
            {page_id === chapter.uid &&
              activeSectionsByPageId.map((section) => {
                return (
                  <div
                    key={section.uid}
                    className='section-nav'
                    style={{ paddingLeft: 20 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      getSubSections(section);
                    }}
                  >
                    {section.title}
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
};

const RightBookContainer = ({ node, book_id }) => {
  return (
    <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
      <ul className='list-item' style={{ paddingLeft: 0, listStyle: 'none' }}>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <LuFileEdit color='#2d2d2d' size={16} />
          <Link to={`/edit/book/${book_id}`} style={{ marginLeft: 5 }}>
            Edit this page
          </Link>
        </li>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <LuFileWarning color='#2d2d2d' size={16} />
          <span style={{ marginLeft: 5 }}>Report</span>
        </li>
      </ul>
      <div style={{ borderTop: '1px solid #ccc', marginTop: 5, paddingTop: 5 }}>
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          <li>{node.title}</li>
        </ul>
      </div>
    </div>
  );
};

const EditContainerMobile = ({ node, book_id }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingTop: 15,
      }}
    >
      <ul className='list-item' style={{ paddingLeft: 0, listStyle: 'none' }}>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <LuFileEdit color='#2d2d2d' size={16} />
          <Link to={`/edit/book/${book_id}`} style={{ marginLeft: 5 }}>
            Edit this page
          </Link>
        </li>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <LuFileWarning color='#2d2d2d' size={16} />
          <span style={{ marginLeft: 5 }}>Report</span>
        </li>
      </ul>
    </div>
  );
};
export default View;
