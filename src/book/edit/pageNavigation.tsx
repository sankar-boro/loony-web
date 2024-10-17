import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md'
import {
  ChapterNavContainer,
  ButtonNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
} from '../../components/Containers.tsx'
import { getSections, getSubSections } from 'loony-utils'
import { LuFileWarning, LuFileEdit } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import {
  ApiDispatchAction,
  EditBookState,
  EditBookAction,
  DocNode,
} from 'loony-types'

const Button = ({
  onClick,
  title,
}: {
  title: string
  onClick: React.MouseEventHandler<HTMLDivElement>
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

export const PageNavigation = (props: {
  setState: EditBookAction
  setStatus: ApiDispatchAction
  nodes101: DocNode[]
  state: EditBookState
  book_id: number
  isMobile: boolean
}) => {
  const { book_id, state, setState, setStatus, isMobile } = props
  const {
    page_id,
    activeSectionsByPageId,
    frontPage,
    activeNode,
    allSectionsByPageId,
    allSubSectionsBySectionId,
    nodes101,
  } = state

  if (!frontPage || !activeNode) return null

  return (
    <>
      <ChapterNavContainer
        onClick={() => {
          setState({
            ...state,
            page_id: frontPage.uid,
            activeNode: frontPage,
            editNode: null,
            addNode: null,
            modal: '',
          })
        }}
        isActive={activeNode.uid === frontPage.uid}
      >
        {frontPage.title}
      </ChapterNavContainer>
      <ButtonNavContainer>
        <Button
          onClick={() => {
            setState({
              ...state,
              topNode: frontPage,
              modal: 'add_chapter',
            })
          }}
          title="Add Chapter"
        />
      </ButtonNavContainer>
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
                    modal: 'add_chapter',
                  })
                }}
                title="Add Chapter"
              />
            </ButtonNavContainer>
            {/* Sections */}
            {page_id === chapter.uid && (
              <SectionsNavContainer>
                <ButtonNavContainer>
                  <Button
                    title="Add Section"
                    onClick={() => {
                      setState({
                        ...state,
                        topNode: chapter,
                        modal: 'add_section',
                      })
                    }}
                  />
                </ButtonNavContainer>
                {activeSectionsByPageId.map((section) => {
                  return (
                    <div key={section.uid}>
                      <SectionNavContainer
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
                      <Button
                        title="Add Section"
                        onClick={(e) => {
                          setState({
                            ...state,
                            topNode: section,
                            modal: 'add_section',
                          })
                          e.stopPropagation()
                        }}
                      />
                    </div>
                  )
                })}
              </SectionsNavContainer>
            )}
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
