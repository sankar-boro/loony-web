import { useEffect, useState, useCallback } from 'react'
import { axiosInstance } from 'loony-query'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { parseImage, timeAgo } from 'loony-utils'

import CardLoader from '../components/CardLoader.tsx'
import Navbar from './Navbar.tsx'
import { AppRouteProps, DocNode, AuthStatus } from 'loony-types'

// Utility function to handle data fetching based on auth status
const fetchData = async (
  url: string,
  setData: React.Dispatch<React.SetStateAction<DocNode[]>>
) => {
  try {
    const { data } = await axiosInstance.get(url)
    setData(data)
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}

const Home = (props: AppRouteProps) => {
  const { isMobile, authContext, appContext } = props
  const { user } = authContext
  const { base_url } = appContext.env
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<DocNode[]>([])
  const [books, setBooks] = useState<DocNode[]>([])
  const [book_page_no] = useState(1)
  const [blog_page_no] = useState(1)

  // Fetch blogs based on auth status
  const fetchBlogs = useCallback(() => {
    const url =
      authContext.status === AuthStatus.AUTHORIZED && user
        ? `/blog/get/${user.uid}/get_all_blogs_liked_by_user`
        : `/blog/get/${blog_page_no}/by_page`
    fetchData(url, setBlogs)
  }, [])

  // Fetch books based on auth status
  const fetchBooks = useCallback(() => {
    const url =
      authContext.status === AuthStatus.AUTHORIZED && user
        ? `/book/get/${user.uid}/get_all_books_liked_by_user`
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
      {!isMobile ? <Navbar {...props} /> : null}
      <div
        style={{
          width: isMobile ? '100%' : '60%',
          paddingRight: isMobile ? '0%' : '5%',
          paddingLeft: isMobile ? '0%' : '5%',
        }}
      >
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
  documents: DocNode[]
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
        {!documents
          ? [1, 2, 3, 4].map((key) => {
              return <CardLoader key={key} />
            })
          : null}
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

const Card = ({
  node,
  navigate,
  nodeType,
  base_url,
}: {
  node: DocNode
  navigate: NavigateFunction
  nodeType: string
  base_url: string
}) => {
  const image = parseImage(node.images)
  return (
    <div className="card" key={node.uid}>
      <div
        className="card-image"
        style={{
          backgroundImage:
            image && image.name
              ? `url("${base_url}/api/${nodeType}/${node.uid}/340/${image.name}")`
              : undefined,
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node.uid}`)
        }}
      />
      <div className="card-body">
        <div
          className="card-title cursor"
          onClick={() => {
            navigate(`/view/${nodeType}/${node.uid}`)
          }}
        >
          {node.title}
        </div>
        <div
          className="flex-row"
          style={{
            marginTop: 5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            className="avatar"
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#ccc',
              borderRadius: 30,
              marginRight: 10,
            }}
          ></div>
          <div style={{ fontSize: 12 }}>
            <div className="username">Sankar Boro</div>
            <div className="username">{timeAgo(node.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
