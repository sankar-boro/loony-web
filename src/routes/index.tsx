import { useState, lazy, Suspense } from 'react'
import { Routes, Route as ReactRoute } from 'react-router-dom'

import { CREATE_BOOK, CREATE_BLOG } from 'loony-api'
import {
  NotificationContextProps,
  AppContextProps,
  AuthContextProps,
  AuthStatus,
} from 'loony-types'

import Home from '../home/index.tsx'
import BlogView from '../blog/view/index.tsx'
import EditBlog from '../blog/edit/index.tsx'
import EditBook from '../book/edit/index.tsx'
import BookView from '../book/view/index.tsx'
import Profile from '../profile/index.tsx'
import Login from '../auth/Login.tsx'
import Signup from '../auth/Signup.tsx'
import Alert from '../components/Alert.tsx'
import NotFound from '../error/NotFound.tsx'
import UnAuthorized from '../error/UnAuthorized.tsx'
import Create from '../form/createDocument.tsx'
import Navigation from '../navigation/topNavbar/index.tsx'
import PageLoadingContainer from '../components/PageLoadingContainer.tsx'
const ContentPolicy = lazy(() => import('../static/ContentPolicy.tsx'))
const PrivacyPolicy = lazy(() => import('../static/PrivacyPolicy.tsx'))
const UserAgreement = lazy(() => import('../static/UserAgreement.tsx'))

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
  const isMobile = appContext.device.type === 'mobile' ? true : false
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
      {authContext.status === AuthStatus.AUTHORIZED && (
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
            element={
              <Suspense
                fallback={
                  <PageLoadingContainer title="Content Policy" {...props} />
                }
              >
                <ContentPolicy />
              </Suspense>
            }
          />
          <ReactRoute
            path="/policies/PrivacyPolicy"
            element={
              <Suspense
                fallback={
                  <PageLoadingContainer title="Privacy Policy" {...props} />
                }
              >
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <ReactRoute
            path="/policies/UserAgreement"
            element={
              <Suspense
                fallback={
                  <PageLoadingContainer title="User Agreement" {...props} />
                }
              >
                <UserAgreement />
              </Suspense>
            }
          />
          <ReactRoute path="/unauthorized" element={<UnAuthorized />} />
          <ReactRoute path="*" element={<NotFound />} />
        </Routes>
      )}
      {authContext.status === AuthStatus.UNAUTHORIZED && (
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
          <ReactRoute path="/edit/book/:bookId" element={<UnAuthorized />} />
          <ReactRoute path="/edit/blog/:blogId" element={<UnAuthorized />} />
          <ReactRoute
            path="/policies/ContentPolicy"
            element={
              <Suspense
                fallback={
                  <PageLoadingContainer title="Content Policy" {...props} />
                }
              >
                <ContentPolicy />
              </Suspense>
            }
          />
          <ReactRoute
            path="/policies/PrivacyPolicy"
            element={
              <Suspense
                fallback={
                  <PageLoadingContainer title="Privacy Policy" {...props} />
                }
              >
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <ReactRoute
            path="/policies/UserAgreement"
            element={
              <Suspense
                fallback={
                  <PageLoadingContainer title="User Agreement" {...props} />
                }
              >
                <UserAgreement />
              </Suspense>
            }
          />
          <ReactRoute path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  )
}

export default Route
