import { useState, useEffect } from 'react';
import { LuFileEdit } from 'react-icons/lu';
import { LuFileWarning } from 'react-icons/lu';
import { extractImage, orderBookNodes, orderNodes } from 'loony-utils';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../query';
import PageLoader from '../components/PageLoader';

const View = ({ mobileNavOpen, setMobileNavOpen, isMobile }) => {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const [bookNodes, setBookNodes] = useState(null);
  const [mainChapter, setMainchapter] = useState(null);
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);
  const [navNodes, setNavNodes] = useState([]);
  const [navChildNodes, setNavChildNodes] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [page_id, setPageId] = useState(null);
  const [section_id, setSectionId] = useState(null);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        const books_ = orderBookNodes(data.data);
        const mainNode_ = books_ && books_[0];
        const childNodes_ = books_.slice(1);
        if (mainNode_) {
          setMainNode(mainNode_);
          setMainchapter(mainNode_);
          setNavNodes(childNodes_);
          setBookNodes(books_);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, [book_id]);

  useEffect(() => {
    if (page_id && mainNode.identity === 101) {
      axiosInstance
        .get(`/book/get_book_sections?book_id=${book_id}&page_id=${page_id}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, mainNode);
          setNavChildNodes(res);
        });
    }
  }, [book_id, page_id, mainNode]);

  useEffect(() => {
    if (section_id && mainNode.identity === 102) {
      axiosInstance
        .get(`/book/get_book_sub_sections?book_id=${book_id}&page_id=${section_id}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, mainNode);
          setChildNodes(res);
        });
    }
  }, [book_id, section_id, mainNode]);

  if (!bookNodes) return null;

  const image = extractImage(mainNode.images);

  if (!mainChapter)
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
              position: 'fixed',
              width: '100%',
              height: '100%',
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
              }}
            >
              <div style={{ width: '100%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
                <div className='chapter-nav-con'>
                  <div
                    className='chapter-nav'
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainNode(mainChapter);
                      setChildNodes(mainChapter.child);
                    }}
                  >
                    {mainChapter.title}
                  </div>
                </div>
                {navNodes.map((chapter) => {
                  return (
                    <div key={chapter.uid}>
                      <div className='chapter-nav-con'>
                        <div
                          className='chapter-nav'
                          onClick={(e) => {
                            e.stopPropagation();
                            setMainNode(chapter);
                            setPageId(chapter.uid);
                            setChildNodes([]);
                            setNavOpen(true);
                          }}
                        >
                          <div style={{ width: '90%' }}>{chapter.title}</div>
                          <div>
                            {mainNode.uid === chapter.uid && navOpen ? (
                              <MdOutlineKeyboardArrowDown size={16} color='#2d2d2d' />
                            ) : (
                              <MdOutlineKeyboardArrowRight
                                size={16}
                                color='#2d2d2d'
                                onClick={() => {
                                  setNavOpen(false);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {page_id === chapter.uid &&
                        chapter.child.map((section) => {
                          return (
                            <div
                              key={section.uid}
                              className='section-nav'
                              style={{ paddingLeft: 20 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setMainNode(section);
                                setSectionId(section.uid);
                                setChildNodes(section.child);
                              }}
                            >
                              {section.title}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
        {!isMobile ? (
          <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
            <div className='chapter-nav-con'>
              <div
                className='chapter-nav'
                onClick={(e) => {
                  e.stopPropagation();
                  setMainNode(mainChapter);
                  setChildNodes(mainChapter.child);
                  setPageId(mainChapter.uid);
                }}
              >
                {mainChapter.title}
              </div>
            </div>
            {navNodes.map((chapter) => {
              return (
                <div key={chapter.uid}>
                  <div className='chapter-nav-con'>
                    <div
                      className='chapter-nav'
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainNode(chapter);
                        setPageId(chapter.uid);
                        setChildNodes([]);
                        setNavOpen(true);
                      }}
                    >
                      <div style={{ width: '90%' }}>{chapter.title}</div>
                      <div>
                        {mainNode.uid === chapter.uid && navOpen ? (
                          <MdOutlineKeyboardArrowDown size={16} color='#2d2d2d' />
                        ) : (
                          <MdOutlineKeyboardArrowRight
                            size={16}
                            color='#2d2d2d'
                            onClick={() => {
                              setNavOpen(false);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {page_id === chapter.uid &&
                    navChildNodes.map((section) => {
                      return (
                        <div
                          key={section.uid}
                          className='section-nav'
                          style={{ paddingLeft: 20 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMainNode(section);
                            setSectionId(section.uid);
                          }}
                        >
                          {section.title}
                        </div>
                      );
                    })}
                </div>
              );
            })}
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
            <div className='page-heading'>{mainNode.title}</div>
            {image && image.name ? (
              <div style={{ width: '100%', borderRadius: 5 }}>
                <img
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/i/${image.name}`}
                  alt=''
                  width='100%'
                />
              </div>
            ) : null}
            <MarkdownPreview
              source={mainNode.body}
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          </div>
          {childNodes.map((book_node) => {
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
        {!isMobile ? <RightBookContainer node={mainNode} book_id={book_id} /> : null}
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
