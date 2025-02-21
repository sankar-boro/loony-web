import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md'
import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
  ButtonNavContainer,
} from '../../components/Containers.tsx'
import {
  getChapter,
  getSection,
  // getSections,
  // getSubSections,
} from 'loony-utils'
import { LuFileWarning, LuFileEdit } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import {
  EditBookAction,
  EditBookState,
  VoidReturnFunction,
  // PageStatusDispatchAction,
} from 'loony-types'

const Button = ({
  onClick,
  title,
}: {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
  title: string
}) => {
  return (
    <div
      className="button-none"
      onClick={onClick}
      style={{ padding: '3px 0px' }}
    >
      {title}
    </div>
  )
}

export const PageNavigation = ({
  setState,
  state,
  book_id,
  isMobile,
  viewFrontPage,
}: // setStatus,
{
  setState: EditBookAction
  state: EditBookState
  book_id: number
  isMobile: boolean
  viewFrontPage: VoidReturnFunction
  // setStatus: PageStatusDispatchAction
}) => {
  const {
    page_id,
    // activeSectionsByPageId,
    frontPage,
    parentNode,
    allSectionsByPageId,
    allSubSectionsBySectionId,
    navNodes,
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
      <ButtonNavContainer>
        <Button
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault()
            setState((prevState) => ({
              ...prevState,
              topNode: frontPage,
              form: 'add_chapter',
            }))
          }}
          title="Add Chapter"
        />
      </ButtonNavContainer>
      {navNodes.map((chapter) => {
        return (
          <div key={chapter.uid}>
            <PageNavContainer
              onClick={(e) => {
                e.stopPropagation()
                getChapter(chapter, setState, allSectionsByPageId, book_id)
              }}
              isActive={parentNode.uid === chapter.uid}
            >
              <div style={{ width: '90%' }}>{chapter.title}</div>
              <div>
                {page_id === chapter.uid ? (
                  <MdOutlineKeyboardArrowDown size={16} color="#2d2d2d" />
                ) : (
                  <MdOutlineKeyboardArrowRight size={16} color="#2d2d2d" />
                )}
              </div>
            </PageNavContainer>
            <ButtonNavContainer>
              <Button
                onClick={() => {
                  setState({
                    ...state,
                    topNode: chapter,
                    form: 'add_chapter',
                  })
                }}
                title="Add Chapter"
              />
            </ButtonNavContainer>
            {/* Sections */}
            {/* {page_id === chapter.uid && (
              
            )} */}
            <SectionsNavContainer>
              <ButtonNavContainer>
                <Button
                  title="Add Section"
                  onClick={() => {
                    setState({
                      ...state,
                      topNode: chapter,
                      form: 'add_section',
                    })
                  }}
                />
              </ButtonNavContainer>
              {chapter.child?.map((section) => {
                return (
                  <div key={section.uid}>
                    <SectionNavContainer
                      onClick={(e) => {
                        e.stopPropagation()
                        getSection(
                          section,
                          setState,
                          allSubSectionsBySectionId,
                          book_id
                        )
                      }}
                      isActive={parentNode.uid === section.uid}
                    >
                      {section.title}
                    </SectionNavContainer>
                    <Button
                      title="Add Section"
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        setState({
                          ...state,
                          topNode: section,
                          form: 'add_section',
                        })
                        e.stopPropagation()
                      }}
                    />
                  </div>
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
              <Link to={`/view/book/${book_id}`}>Read Book</Link>
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to="#">Report</Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  )
}
