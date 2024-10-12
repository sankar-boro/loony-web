import { useEffect, useState } from 'react';
import { axiosInstance } from 'loony-query';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from 'loony-utils';

import CardLoader from '../components/CardLoader';
import Navbar from './Navbar';
import { AUTHORIZED } from 'loony-types';

const Home = (props) => {
  const { isMobile, auth } = props;
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(null);
  const [books, setBooks] = useState(null);
  const [book_page_no, setBookPageNo] = useState(1);
  const [blog_page_no, setBlogPageNo] = useState(1);

  useEffect(() => {
    axiosInstance
      .get(`/blog/get/${blog_page_no}/by_page`)
      .then(({ data }) => {
        setBlogs(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (auth.status === AUTHORIZED) {
      axiosInstance
        .get(`/book/get/${auth.user.uid}/get_all_books_liked_by_user`)
        .then(({ data }) => {
          setBooks(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosInstance
        .get(`/book/get/${book_page_no}/by_page`)
        .then(({ data }) => {
          setBooks(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [auth.status]);

  useEffect(() => {
    if (auth.status === AUTHORIZED) {
      axiosInstance
        .get(`/blog/get/${auth.user.uid}/get_all_blogs_liked_by_user`)
        .then(({ data }) => {
          setBlogs(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosInstance
        .get(`/blog/get/${blog_page_no}/by_page`)
        .then(({ data }) => {
          setBlogs(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [auth.status]);

  return (
    <div className='home-container flex-row'>
      {!isMobile ? <Navbar {...props} /> : null}
      <div
        style={{
          width: isMobile ? '100%' : '60%',
          paddingRight: isMobile ? '0%' : '5%',
          paddingLeft: isMobile ? '0%' : '5%',
        }}
      >
        <Documents navigate={navigate} isMobile={isMobile} documents={blogs} />
        <Documents navigate={navigate} isMobile={isMobile} documents={books} />
      </div>
    </div>
  );
};

const Documents = ({ navigate, isMobile, documents }) => {
  return (
    <>
      <div
        className='flex-row'
        style={{
          flexWrap: 'wrap',
          marginTop: 20,
          display: 'flex',
          gap: 16,
        }}
      >
        {!documents
          ? [1, 2, 3, 4].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {documents &&
          documents.map((node) => {
            const nodeType = node.doc_type === 1 ? 'blog' : 'book';
            const key = `${node[nodeType]}_${node.uid}}`;
            return (
              <Card
                key={key}
                uid={key}
                node={node}
                navigate={navigate}
                nodeType={nodeType}
                isMobile={isMobile}
              />
            );
          })}
      </div>
    </>
  );
};

const Card = ({ uid, node, navigate, nodeType }) => {
  const image = JSON.parse(node.images)[0];
  return (
    <div className='card' key={uid}>
      <div
        className='card-image'
        style={{
          backgroundImage:
            image && image.name
              ? `url("${process.env.REACT_APP_BASE_API_URL}/api/${nodeType}/${node.uid}/340/${image.name}")`
              : null,
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node.uid}`, node);
        }}
      />
      <div className='card-body'>
        <div
          className='card-title cursor'
          onClick={() => {
            navigate(`/view/${nodeType}/${node.uid}`, node);
          }}
        >
          {node.title}
        </div>
        <div
          className='flex-row'
          style={{
            marginTop: 5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            className='avatar'
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#ccc',
              borderRadius: 30,
              marginRight: 10,
            }}
          ></div>
          <div style={{ fontSize: 12 }}>
            <div className='username'>Sankar Boro</div>
            <div className='username'>{timeAgo(node.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
