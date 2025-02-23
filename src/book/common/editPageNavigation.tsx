// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowDown,
// } from 'react-icons/md'
import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
  ChapterButtonNavContainer,
  SectionButtonNavContainer,
} from '../../components/Containers.tsx'
import {
  getChapter,
  getSection,
  // getSections,
  // getSubSections,
} from 'loony-utils'
import { LuFileWarning } from 'react-icons/lu'
import { FiEdit2 } from "react-icons/fi";
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
  doc_id,
  isMobile,
  viewFrontPage,
}: // setStatus,
{
  setState: EditBookAction
  state: EditBookState
  doc_id: number
  isMobile: boolean
  viewFrontPage: VoidReturnFunction
  // setStatus: PageStatusDispatchAction
}) => {
  const { frontPage, parentNode, groupNodesById, navNodes } = state

  if (!frontPage || !parentNode) return null

  return (
    <>
      <ChapterNavContainer
        onClick={viewFrontPage}
        isActive={parentNode.uid === frontPage.uid}
      >
        {frontPage.title}
      </ChapterNavContainer>
      <ChapterButtonNavContainer>
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
      </ChapterButtonNavContainer>
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
              <div style={{ width: '90%' }}>{chapter.title}</div>
            </PageNavContainer>
            <ChapterButtonNavContainer>
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
            </ChapterButtonNavContainer>
            <SectionsNavContainer>
              <SectionButtonNavContainer>
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
              </SectionButtonNavContainer>
              {chapter.child?.map((section) => {
                return (
                  <div key={section.uid}>
                    <SectionNavContainer
                      onClick={(e) => {
                        e.stopPropagation()
                        getSection(section, setState, groupNodesById, doc_id)
                      }}
                      isActive={parentNode.uid === section.uid}
                    >
                      {section.title}
                    </SectionNavContainer>
                    <SectionButtonNavContainer>
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
                    </SectionButtonNavContainer>
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
              <FiEdit2 color="#2d2d2d" size={16} />
              <Link to={`/view/book/${doc_id}`}>Read Book</Link>
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
