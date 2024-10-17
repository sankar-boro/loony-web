import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md'
import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
} from '../../components/Containers.tsx'
import { getSections, getSubSections } from 'loony-utils'
import { LuFileWarning, LuFileEdit } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import {
  ApiDispatchAction,
  ReadBookAction,
  ReadBookState,
  DocNode,
} from 'loony-types'

export const PageNavigation = ({
  setState,
  setStatus,
  nodes101,
  state,
  book_id,
  isMobile,
}: {
  setState: ReadBookAction
  setStatus: ApiDispatchAction
  nodes101: DocNode[]
  state: ReadBookState
  book_id: number
  isMobile: boolean
}) => {
  const {
    page_id,
    activeSectionsByPageId,
    frontPage,
    activeNode,
    allSectionsByPageId,
    allSubSectionsBySectionId,
  } = state

  if (!frontPage || !activeNode) return null

  return (
    <>
      <ChapterNavContainer
        onClick={(e) => {
          e.stopPropagation()
          setState((prevState) => ({
            ...prevState,
            page_id: frontPage.uid,
            activeNode: frontPage,
            activeSubSectionsBySectionId: [],
          }))
        }}
        isActive={activeNode.uid === frontPage.uid}
      >
        {frontPage.title}
      </ChapterNavContainer>
      {nodes101.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer
              onClick={(e) => {
                e.stopPropagation()
                getSections(
                  chapter,
                  setState,
                  setStatus,
                  allSectionsByPageId,
                  book_id
                )
              }}
              isActive={activeNode.uid === chapter.uid}
            >
              <div className="page-nav-title">{chapter.title}</div>
              <div className="page-nav-icon">
                {page_id === chapter.uid ? (
                  <MdOutlineKeyboardArrowDown size={16} color="#2d2d2d" />
                ) : (
                  <MdOutlineKeyboardArrowRight size={16} color="#2d2d2d" />
                )}
              </div>
            </PageNavContainer>
            <SectionsNavContainer
              onClick={() => {
                return
              }}
            >
              {page_id === chapter.uid &&
                activeSectionsByPageId.map((section) => {
                  return (
                    <SectionNavContainer
                      key={section.uid}
                      onClick={(e) => {
                        e.stopPropagation()
                        getSubSections(
                          section,
                          setState,
                          setStatus,
                          allSubSectionsBySectionId,
                          book_id
                        )
                      }}
                      isActive={activeNode.uid === section.uid}
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
              <Link to={`/edit/book/${book_id}`}>Edit this page</Link>
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to={`/edit/book/${book_id}`}>Report</Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  )
}
