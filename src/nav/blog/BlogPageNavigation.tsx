import { BasicMenuNavContainer } from "../../components/Containers.tsx"
import { LuFileWarning } from "react-icons/lu"
import { FiEdit2 } from "react-icons/fi"
import { Link } from "react-router-dom"
import {
  AuthContextProps,
  AuthStatus,
  DocNode,
  EditBlogState,
  ReadBlogState,
} from "loony-types"

export const Chapters = ({
  state,
}: {
  state: EditBlogState | ReadBlogState
}) => {
  const { childNodes } = state
  return (
    <>
      {childNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <BasicMenuNavContainer>
              <div className="page-nav-title">{chapter.title}</div>
            </BasicMenuNavContainer>
          </div>
        )
      })}
    </>
  )
}

export const Edit = ({
  blog_id,
  authContext,
  mainNode,
}: {
  blog_id: number
  authContext: AuthContextProps
  mainNode: DocNode
}) => {
  return (
    <ul className="list-item" style={{ paddingLeft: 0, listStyle: "none" }}>
      {authContext.status === AuthStatus.AUTHORIZED &&
      authContext.user?.uid === mainNode.user_id ? (
        <li>
          <FiEdit2 color="#2d2d2d" size={16} />
          <Link to={`/edit/blog/${blog_id}`}>Edit this page</Link>
        </li>
      ) : null}
      <li>
        <LuFileWarning color="#2d2d2d" size={16} />
        <Link to="#">Report</Link>
      </li>
    </ul>
  )
}
