// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowDown,
// } from 'react-icons/md'
import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
} from '../../components/Containers.tsx'
import { getChapter, getSection } from 'loony-utils'
import { LuFileWarning, LuFileEdit } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import {
  ReadBookAction,
  ReadBookState,
  DocNode,
  EditBookAction,
  EditBookState,
  VoidReturnFunction,
  // PageStatusDispatchAction,
} from 'loony-types'

export const PageNavigation = ({
  setState,
  navNodes,
  state,
  doc_id,
  isMobile,
  viewFrontPage,
}: // setStatus,
{
  setState: ReadBookAction | EditBookAction
  navNodes: DocNode[]
  state: ReadBookState | EditBookState
  doc_id: number
  isMobile: boolean
  viewFrontPage: VoidReturnFunction
  // setStatus: PageStatusDispatchAction
}) => {
  const {
    // page_id,
    // activeSectionsByPageId,
    frontPage,
    parentNode,
    groupNodesById,
  } = state

  if (!frontPage || !parentNode) return null

  return (
    <>
      <ChapterNavContainer
        onClick={viewFrontPage}
        isActive={parentNode.uid === frontPage.uid}
      >
        {frontPage.title}
      </ChapterNavContainer>
      {navNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer
              onClick={(e) => {
                e.stopPropagation()
                getChapter(chapter, setState, groupNodesById, doc_id)
              }}
              isActive={parentNode.uid === chapter.uid}
            >
              {chapter.title}
            </PageNavContainer>
            <SectionsNavContainer
              onClick={() => {
                return
              }}
            >
              {/* {page_id === chapter.uid &&
                } */}
              {chapter.child?.map((section) => {
                return (
                  <SectionNavContainer
                    key={section.uid}
                    onClick={(e) => {
                      e.stopPropagation()
                      getSection(section, setState, groupNodesById, doc_id)
                    }}
                    isActive={parentNode.uid === section.uid}
                  >
                    {section.title}
                  </SectionNavContainer>
                )
              })}
            </SectionsNavContainer>
          </div>
        )
      })}
      {isMobile ? (
        <div
          style={{ marginTop: 20, borderTop: '1px solid #ccc', paddingTop: 12 }}
        >
          <ul
            className="list-item"
            style={{ paddingLeft: 0, listStyle: 'none' }}
          >
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <LuFileEdit color="#2d2d2d" size={16} />
              <Link to={`/edit/book/${doc_id}`}>Edit this page</Link>
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to={`/edit/book/${doc_id}`}>Report</Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  )
}
