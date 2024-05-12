import { useState, useEffect } from 'react';
import { LuFileEdit } from 'react-icons/lu';
import { LuFileWarning } from 'react-icons/lu';
import { extractImage, orderBookNodes } from 'loony-utils';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../query';

const View = () => {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const [books, setBooks] = useState(null);
  const [mainChapter, setMainchapter] = useState(null);
  const [page_id, setPageId] = useState('');
  const [mainNode, setMainNode] = useState(null);
  const [nav_id, setNavId] = useState(null);
  const [childNodes, setChildNodes] = useState([]);
  const [navNodes, setNavNodes] = useState([]);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        const books_ = orderBookNodes(data.data);
        const mainNode_ = books_ && books_[0];
        const childNodes_ = books_.slice(1);
        if (mainNode_) {
          setMainchapter(mainNode_);
          setBooks(books_);
          setMainNode(mainNode_);
          setNavId(mainNode_.uid);
          setNavNodes(childNodes_);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, [book_id]);

  if (!books) return null;
  if (!page_id) return null;

  const image = extractImage(mainNode.images);
  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        {/*
         * @ Left Navigation
         */}
        <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
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
          {navNodes.map((book_node) => {
            return (
              <div key={book_node.uid}>
                <div className='chapter-nav-con'>
                  <div
                    className='chapter-nav'
                    onClick={(e) => {
                      e.stopPropagation();
                      setChildNodes(book_node.child);
                      setMainNode(book_node);
                      setNavId(book_node.uid);
                      setNavOpen(true);
                    }}
                  >
                    <div style={{ width: '90%' }}>{book_node.title}</div>
                    <div>
                      {mainNode.uid === book_node.uid && navOpen ? (
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
                {nav_id === book_node.uid &&
                  book_node.child.map((section) => {
                    return (
                      <div
                        key={section.uid}
                        className='section-nav'
                        style={{ paddingLeft: 20 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainNode(section);
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
        {/*
         * @ Left Navigation End
         */}

        {/*
         * @Page
         */}
        <div
          style={{
            width: '60%',
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
        </div>
        {/*
         * @Page End
         */}
        <RightBookContainer node={mainNode} book_id={book_id} />
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
