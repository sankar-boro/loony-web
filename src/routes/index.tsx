import Home from '../home/index.tsx'
import BlogView from '../blog/View.tsx'
import EditBlog from '../blog/Edit.tsx'
import EditBook from '../book/edit/index.tsx'
import BookView from '../book/view/index.tsx'
import Profile from '../profile/index.tsx'
import Login from '../auth/Login.tsx'
import Signup from '../auth/Signup.tsx'
import Alert from '../components/Alert.tsx'
import NotFound from '../error/NotFound.tsx'
import AuthError from '../error/AuthError.tsx'
import Create from '../form/createDocument.tsx'
import { CREATE_BOOK, CREATE_BLOG } from 'loony-query'
import { AUTHORIZED, NotificationContextProps, UNAUTHORIZED } from 'loony-types'
import Navigation from '../navigation/topNavbar/index.tsx'
import { Routes, Route as ReactRoute } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ContentPolicy from '../static/ContentPolicy.tsx'
import PrivacyPolicy from '../static/PrivacyPolicy.tsx'
import UserAgreement from '../static/UserAgreement.tsx'
import { AppContextProps, AuthContextProps } from 'loony-types'

const Route = ({
  authContext,
  appContext,
  notificationContext,
}: {
  authContext: AuthContextProps
  appContext: AppContextProps
  notificationContext: NotificationContextProps
}): React.JSX.Element => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (window.innerWidth <= 720) {
      setIsMobile(true)
    }
  }, [])

  const props = {
    setMobileNavOpen,
    mobileNavOpen,
    isMobile,
    authContext,
    appContext,
    notificationContext,
  }

  const onCloseAlert = () => {
    appContext.setAppContext((prevState) => ({
      ...prevState,
      alert: null,
    }))
  }

  return (
    <>
      {notificationContext.alert && (
        <Alert alert={notificationContext.alert} onClose={onCloseAlert} />
      )}
      <Navigation
        auth={authContext}
        setMobileNavOpen={setMobileNavOpen}
        isMobile={isMobile}
      />
      {authContext.status === AUTHORIZED && (
        <Routes>
          <ReactRoute path="/" element={<Home {...props} />} />
          <ReactRoute
            path="/view/book/:bookId"
            element={<BookView {...props} />}
          />
          <ReactRoute
            path="/view/blog/:blogId"
            element={<BlogView {...props} />}
          />
          <ReactRoute
            path="/create/book"
            element={
              <Create url={CREATE_BOOK} title="Create Book" {...props} />
            }
          />
          <ReactRoute
            path="/create/blog"
            element={
              <Create url={CREATE_BLOG} title="Create Blog" {...props} />
            }
          />
          <ReactRoute
            path="/edit/book/:bookId"
            element={<EditBook {...props} />}
          />
          <ReactRoute
            path="/edit/blog/:blogId"
            element={<EditBlog {...props} />}
          />
          <ReactRoute path="/profile" element={<Profile {...props} />} />
          <ReactRoute
            path="/policies/ContentPolicy"
            element={<ContentPolicy />}
          />
          <ReactRoute
            path="/policies/PrivacyPolicy"
            element={<PrivacyPolicy />}
          />
          <ReactRoute
            path="/policies/UserAgreement"
            element={<UserAgreement />}
          />
          <ReactRoute path="/unauthorized" element={<AuthError />} />

          <ReactRoute path="*" element={<NotFound />} />
        </Routes>
      )}
      {authContext.status === UNAUTHORIZED && (
        <Routes>
          <ReactRoute path="/" element={<Home {...props} />} />
          <ReactRoute path="/login" element={<Login {...props} />} />
          <ReactRoute path="/signup" element={<Signup {...props} />} />
          <ReactRoute
            path="/view/book/:bookId"
            element={<BookView {...props} />}
          />
          <ReactRoute
            path="/view/blog/:blogId"
            element={<BlogView {...props} />}
          />
          <ReactRoute path="/edit/book/:bookId" element={<AuthError />} />
          <ReactRoute path="/edit/blog/:blogId" element={<AuthError />} />
          <ReactRoute
            path="/policies/ContentPolicy"
            element={<ContentPolicy />}
          />
          <ReactRoute
            path="/policies/PrivacyPolicy"
            element={<PrivacyPolicy />}
          />
          <ReactRoute
            path="/policies/UserAgreement"
            element={<UserAgreement />}
          />
          <ReactRoute path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  )
}

export default Route
