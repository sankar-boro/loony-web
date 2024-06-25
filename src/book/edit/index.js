import { useState, useEffect, useContext } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { orderBookNodes, extractImage } from 'loony-utils';
import { RxReader } from 'react-icons/rx';
import { AiOutlineDelete } from 'react-icons/ai';
import { LuFileWarning } from 'react-icons/lu';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { axiosInstance } from 'loony-query';
import { AuthContext } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';
import { ModalComponent } from './modal';
import { PageNavigation } from './pageNavigation';
import { PageNodeSettings } from './pageNodeSettings';

export default function Edit() {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const navigate = useNavigate();
  const { setContext } = useContext(AuthContext);

  const [state, setState] = useState({
    modal: '',
    deleteNode: null,
    editNode: null,
    activeNode: null,
    topNode: null,
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <PageNavigation setState={setState} nodes101={nodes101} state={state} book_id={book_id} />

        {/* Page */}
        <div
          style={{
            width: '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            paddingBottom: 100,
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
            minHeight: '100vh',
          }}
        >
          <div>
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
          <PageNodeSettings node={activeNode} setState={setState} state={state} />

          <div
            style={{
              marginTop: 16,
            }}
          >
            {activeSubSectionsBySectionId.map((subSectionNode) => {
              const subSectionNodeImage = extractImage(subSectionNode.images);

              return (
                <div className='page-section' key={subSectionNode.uid}>
                  <div className='section-title'>{subSectionNode.title}</div>
                  {subSectionNodeImage && subSectionNodeImage.name ? (
                    <div style={{ width: '100%', borderRadius: 5 }}>
                      <img
                        src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${subSectionNodeImage.name}`}
                        alt=''
                        width='100%'
                      />
                    </div>
                  ) : null}
                  <MarkdownPreview
                    source={subSectionNode.body}
                    wrapperElement={{ 'data-color-mode': 'light' }}
                  />
                  <PageNodeSettings node={subSectionNode} setState={setState} state={state} />
                </div>
              );
            })}
          </div>
        </div>

        <RightBookContainer book_id={book_id} setState={setState} state={state} />
      </div>

      <ModalComponent
        state={state}
        setState={setState}
        setContext={setContext}
        book_id={book_id}
        navigate={navigate}
      />
    </div>
  );
}

const RightBookContainer = ({ book_id, setState, state }) => {
  return (
    <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }} className='list-item'>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <RxReader size={16} color='#2d2d2d' />
          <Link to={`/view/book/${book_id}`} style={{ marginLeft: 5 }}>
            Read Book
          </Link>
        </li>
        <li
          onClick={() => {
            setState({
              ...state,
              modal: 'delete_book',
            });
          }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <AiOutlineDelete size={16} color='#2d2d2d' />
          <span style={{ marginLeft: 5 }}>Delete Book</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <LuFileWarning size={16} color='#2d2d2d' />
          <span style={{ marginLeft: 5 }}>Report</span>
        </li>
      </ul>
    </div>
  );
};
