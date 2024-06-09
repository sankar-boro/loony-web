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

  const [frontPage, setFrontPage] = useState(null);
  const [nodes101, setNodes101] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [page_id, setPageId] = useState(null);
  const [activeSectionsByPageId, setActiveSectionsByPageId] = useState([]);
  const [allSectionsByPageId, setAllSectionsByPageId] = useState({});
  const [activeSubSectionsBySectionId, setActiveSubSectionsBySectionId] = useState([]);
  const [allSubSectionsBySectionId, setAllSubSectionsBySectionId] = useState({});

  const getChapters = () => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
      const bookTree = orderBookNodes(data.data);
      const thisFrontPage = bookTree && bookTree[0];
      const pages = bookTree.slice(1);

      if (thisFrontPage) {
        setFrontPage(thisFrontPage);
        setActiveNode(thisFrontPage);
        setNodes101(pages);
        setPageId(thisFrontPage.uid);
      }
    });
  };

  const getSections = (node) => {
    const { uid } = node;
    if (allSectionsByPageId[uid]) {
      setActiveSectionsByPageId(allSectionsByPageId[uid]);
    } else {
      axiosInstance
        .get(`/book/get_book_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, node);
          setActiveSectionsByPageId(res);
          setAllSectionsByPageId({
            ...allSectionsByPageId,
            [uid]: res,
          });
        });
    }
  };

  const getSubSections = (node) => {
    const { uid } = node;
    if (allSubSectionsBySectionId[uid]) {
      setActiveSubSectionsBySectionId(allSubSectionsBySectionId[uid]);
    } else {
      axiosInstance
        .get(`/book/get_book_sub_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, node);
          setActiveSubSectionsBySectionId(res);
          setAllSubSectionsBySectionId({
            ...allSubSectionsBySectionId,
            [uid]: res,
          });
        });
    }
  };
  useEffect(() => {
    if (book_id) {
      getChapters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book_id]);

  const reset = (e) => {
    setActiveSubSectionsBySectionId([]);
    e.stopPropagation();
  };

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

  const Navigation = () => {
    return (
      <>
        <div className='chapter-nav-con'>
          <div
            className='chapter-nav'
            onClick={(e) => {
              setPageId(frontPage.uid);
              setActiveNode(frontPage);
              reset(e);
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
                    reset(e);
                    setActiveNode(chapter);
                    setPageId(chapter.uid);
                    getSections(chapter);
                  }}
                >
                  <div style={{ width: '90%' }}>{chapter.title}</div>
                  <div>
                    {activeNode.uid === chapter.uid ? (
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
                        reset(e);
                        setActiveNode(section);
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
  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {/*
         * @ Left Navigation
         */}
        {isMobile && mobileNavOpen ? (
          <div
            style={{
              position: 'fixed',
              width: '100%',
              backgroundColor: 'rgb(0,0,0,0.5)',
              zIndex: 10,
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
                top: -5,
                padding: 12,
              }}
            >
              <Navigation />
            </div>
          </div>
        ) : null}
        {!isMobile ? (
          <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
            <Navigation />
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
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/g/${book_id}/720/${image.name}`}
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
            return (
              <div className='page-section' key={book_node.uid}>
                <div className='section-title'>{book_node.title}</div>
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

export default View;
