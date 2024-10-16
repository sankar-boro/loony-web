import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
// import Navbar from './Navbar.tsx';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { axiosInstance } from 'loony-query';
import CardLoader from '../components/CardLoader.tsx';
import { timeAgo } from 'loony-utils';
import { User } from 'types/index.ts';

const Profile = ({ isMobile }: { isMobile: boolean }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { fname, lname, uid } = auth.user as User;

  return (
    <div className='book-container flex-row'>
      {/* {!isMobile ? <Navbar /> : null} */}
      <div
        style={{
          width: isMobile ? '100%' : '85%',
          padding: isMobile ? '16px 0px' : 24,
        }}
      >
        <div
          className='profile-info'
          style={{
            width: isMobile ? '90%' : '90%',
            height: 150,
            paddingLeft: isMobile ? '5%' : '5%',
            paddingRight: isMobile ? '5%' : '5%',
          }}
        >
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
                width: 80,
                height: 80,
                backgroundColor: '#ccc',
                borderRadius: 80,
                marginRight: 10,
              }}
            ></div>
            <div style={{ fontSize: 12 }}>
              <div className='username'>
                {fname} {lname}
              </div>
            </div>
          </div>
        </div>
        <hr style={{ marginTop: 25, marginBottom: 25, width: '90%' }} />
        <div
          style={{
            width: isMobile ? '100%' : '90%',
            paddingLeft: isMobile ? '0%' : '5%',
            paddingRight: isMobile ? '0%' : '5%',
          }}
        >
          <Blogs user_id={uid} navigate={navigate} isMobile={isMobile} />
          <Books user_id={uid} navigate={navigate} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};

const Blogs = ({ navigate, isMobile, user_id }: { navigate: NavigateFunction, isMobile: boolean, user_id: number }) => {
  const [blogs, setBlogs] = useState<any[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/blog/get/${user_id}/get_all_blogs_liked_by_user`)
      .then(({ data }) => {
        setBlogs(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
        {!blogs
          ? [1, 2, 3, 4].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {blogs &&
          blogs.map((node) => {
            return (
              <Card
                key={node.uid}
                node={node}
                navigate={navigate}
                nodeType='blog'
                nodeIdType='uid'
                isMobile={isMobile}
              />
            );
          })}
      </div>
    </>
  );
};

const Books = ({ navigate, isMobile, user_id }: { navigate: NavigateFunction, isMobile: boolean, user_id: number }) => {
  const [books, setBooks] = useState<any[] | null>(null);
  useEffect(() => {
    axiosInstance
      .get(`/book/get/${user_id}/get_all_books_liked_by_user`)
      .then(({ data }) => {
        setBooks(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        {!books
          ? [5, 6, 7, 8].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {books &&
          books.map((node) => {
            return (
              <Card
                key={node.uid}
                node={node}
                navigate={navigate}
                nodeType='book'
                nodeIdType='uid'
                isMobile={isMobile}
              />
            );
          })}
      </div>
    </>
  );
};

const Card = ({ node, navigate, nodeType, nodeIdType }: { navigate: NavigateFunction, isMobile: boolean, nodeIdType: string, nodeType: string, node: any }) => {
  const image = JSON.parse(node.images)[0];

  return (
    <div className='card' key={node[nodeIdType]}>
      <div
        className='card-image'
        style={{
          backgroundImage:
            image && image.name
              ? `url("${process.env.REACT_APP_BASE_API_URL}/api/${nodeType}/${node[nodeIdType]}/340/${image.name}")`
              : undefined,
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node[nodeIdType]}`, node);
        }}
      />
      <div className='card-body'>
        <div
          className='card-title cursor'
          onClick={() => {
            navigate(`/view/${nodeType}/${node[nodeIdType]}`, node);
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

export default Profile;
