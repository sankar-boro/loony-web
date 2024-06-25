import Home from '../home';
import BlogView from '../blog/View';
import EditBlog from '../blog/Edit';
import EditBook from '../book/edit';
import BookView from '../book/view';
import Profile from '../profile';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import Alert from '../components/Alert';
import NotFound from '../error/NotFound';
import AuthError from '../error/AuthError';
import Create from '../form/createDocument';
import { CREATE_BOOK, CREATE_BLOG } from 'loony-query';
import { AUTHORIZED, UNAUTHORIZED } from 'loony-types';
import Navigation from '../navigation/topNavbar';
import { Routes, Route as ReactRoute } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Route = ({ context, auth }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 720) {
      setIsMobile(true);
    }
  }, []);

  return (
    <>
      {context.alert && <Alert alert={context.alert} onClose={() => {}} />}
      <Navigation auth={auth} setMobileNavOpen={setMobileNavOpen} isMobile={isMobile} />
      {auth.status === AUTHORIZED && (
        <Routes>
          <ReactRoute path='/' element={<Home isMobile={isMobile} />} />
          <ReactRoute
            path='/view/book/:bookId'
            element={
              <BookView
                setMobileNavOpen={setMobileNavOpen}
                mobileNavOpen={mobileNavOpen}
                isMobile={isMobile}
              />
            }
          />
          <ReactRoute path='/view/blog/:blogId' element={<BlogView isMobile={isMobile} />} />
          <ReactRoute
            path='/create/book'
            element={<Create url={CREATE_BOOK} title='Create Book' isMobile={isMobile} />}
          />
          <ReactRoute
            path='/create/blog'
            element={<Create url={CREATE_BLOG} title='Create Blog' isMobile={isMobile} />}
          />
          <ReactRoute
            path='/edit/book/:bookId'
            element={
              <EditBook
                setMobileNavOpen={setMobileNavOpen}
                mobileNavOpen={mobileNavOpen}
                isMobile={isMobile}
              />
            }
          />
          <ReactRoute path='/edit/blog/:blogId' element={<EditBlog isMobile={isMobile} />} />
          <ReactRoute path='/profile' element={<Profile isMobile={isMobile} />} />
          <ReactRoute path='*' element={<AuthError />} />
        </Routes>
      )}
      {auth.status === UNAUTHORIZED && (
        <Routes>
          <ReactRoute path='/' element={<Home isMobile={isMobile} />} />
          <ReactRoute path='/login' element={<Login isMobile={isMobile} />} />
          <ReactRoute path='/signup' element={<Signup isMobile={isMobile} />} />
          <ReactRoute
            path='/view/book/:bookId'
            element={
              <BookView
                setMobileNavOpen={setMobileNavOpen}
                mobileNavOpen={mobileNavOpen}
                isMobile={isMobile}
              />
            }
          />
          <ReactRoute path='/view/blog/:blogId' element={<BlogView isMobile={isMobile} />} />
          <ReactRoute path='/edit/book/:bookId' element={<AuthError />} />
          <ReactRoute path='/edit/blog/:blogId' element={<AuthError />} />
          <ReactRoute path='*' element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

export default Route;
