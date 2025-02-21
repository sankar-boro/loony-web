import { useEffect, useState, useCallback } from 'react'
import { axiosInstance } from 'loony-api'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AppRouteProps, DocNode, AuthStatus } from 'loony-types'

import LeftNavbar from '../common/LeftNavbar.tsx'
import Card from '../components/Card.tsx'
// import CardLoader from '../components/CardLoader.tsx'
import { EmptyBlog, EmptyBook } from '../components/EmptyCard.tsx'

// Utility function to handle data fetching based on auth status
const fetchData = async (
  url: string,
  setData: React.Dispatch<React.SetStateAction<DocNode[] | null>>
) => {
  try {
    const { data } = await axiosInstance.get(url)
    if (data.length > 0) {
      setData(data)
    }
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}

const Home = (props: AppRouteProps) => {
  const { isMobile, authContext, appContext } = props
  const { user } = authContext
  const { base_url } = appContext.env
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<DocNode[] | null>(null)
  const [books, setBooks] = useState<DocNode[] | null>(null)
  const [book_page_no] = useState(1)
  const [blog_page_no] = useState(1)

  // Fetch blogs based on auth status
  const fetchBlogs = useCallback(() => {
    const url =
      authContext.status === AuthStatus.AUTHORIZED && user
        ? `/blog/get/${user.uid}/get_users_blog`
        : `/blog/get/${blog_page_no}/by_page`
    fetchData(url, setBlogs)
  }, [])

  // Fetch books based on auth status
  const fetchBooks = useCallback(() => {
    const url =
      authContext.status === AuthStatus.AUTHORIZED && user
        ? `/book/get/${user.uid}/get_users_book`
        : `/book/get/${book_page_no}/by_page`
    fetchData(url, setBooks)
  }, [])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return (
    <div className="home-container flex-row">
      {!isMobile ? <LeftNavbar /> : null}
      <div className="documents-container">
        <Documents
          navigate={navigate}
          documents={blogs}
          base_url={base_url}
          docType="blog"
        />
        <Documents
          navigate={navigate}
          documents={books}
          base_url={base_url}
          docType="book"
        />
      </div>
    </div>
  )
}

const Documents = ({
  navigate,
  documents,
  base_url,
  docType,
}: {
  navigate: NavigateFunction
  documents: DocNode[] | null
  base_url: string
  docType: string
}) => {
  return (
    <>
      <div
        className="flex-row"
        style={{
          flexWrap: 'wrap',
          marginTop: 20,
          display: 'flex',
          gap: 16,
        }}
      >
        {!documents && docType === 'blog' ? (
          <EmptyBlog navigate={navigate} />
        ) : null}
        {!documents && docType === 'book' ? (
          <EmptyBook navigate={navigate} />
        ) : null}

        {Array.isArray(documents) &&
          documents.map((node: DocNode) => {
            return (
              <Card
                key={node.uid}
                node={node}
                navigate={navigate}
                nodeType={docType}
                base_url={base_url}
              />
            )
          })}
      </div>
    </>
  )
}

export default Home
