import { useEffect, useState } from 'react'
import { axiosInstance } from 'loony-query'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { parseImage, timeAgo } from 'loony-utils'

import CardLoader from '../components/CardLoader.tsx'
import Navbar from './Navbar.tsx'
import { AppRouteProps, DocNode, AuthStatus } from 'loony-types'

const Home = (props: AppRouteProps) => {
  const { isMobile, authContext, appContext } = props
  const { base_url } = appContext.env
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<DocNode[]>([])
  const [books, setBooks] = useState<DocNode[]>([])
  const [book_page_no] = useState(1)
  const [blog_page_no] = useState(1)

  useEffect(() => {
    axiosInstance
      .get(`/blog/get/${blog_page_no}/by_page`)
      .then(({ data }) => {
        setBlogs(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (authContext.status === AuthStatus.AUTHORIZED && authContext.user) {
      axiosInstance
        .get(`/book/get/${authContext.user.uid}/get_all_books_liked_by_user`)
        .then(({ data }) => {
          setBooks(data)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      axiosInstance
        .get(`/book/get/${book_page_no}/by_page`)
        .then(({ data }) => {
          setBooks(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [authContext.status])

  useEffect(() => {
    if (authContext.status === AuthStatus.AUTHORIZED && authContext.user) {
      axiosInstance
        .get(`/blog/get/${authContext.user.uid}/get_all_blogs_liked_by_user`)
        .then(({ data }) => {
          setBlogs(data)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      axiosInstance
        .get(`/blog/get/${blog_page_no}/by_page`)
        .then(({ data }) => {
          setBlogs(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [authContext.status])

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
        {documents &&
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
