import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
} from "../../../components/Containers.tsx"
import { getChapter, getSection } from "loony-utils"
import {
  ReadBookAction,
  ReadBookState,
  DocNode,
  EditBookAction,
  EditBookState,
  VoidReturnFunction,
} from "loony-types"

export const PageNavigation = ({
  setState,
  navNodes,
  state,
  doc_id,
  viewFrontPage,
}: {
  setState: ReadBookAction | EditBookAction
  navNodes: DocNode[]
  state: ReadBookState | EditBookState
  doc_id: number
  viewFrontPage: VoidReturnFunction
}) => {
  const { frontPage, parentNode, groupNodesById } = state

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
    </>
  )
}
