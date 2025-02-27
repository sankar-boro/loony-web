import {
  ChapterNavContainer,
  PageNavContainer,
  SectionNavContainer,
  SectionsNavContainer,
  ChapterButtonNavContainer,
  SectionButtonNavContainer,
} from "../../../components/Containers.tsx"
import { getChapter, getSection } from "loony-utils"
import { EditBookAction, EditBookState, VoidReturnFunction } from "loony-types"

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
      style={{ padding: "3px 0px" }}
    >
      {title}
    </div>
  )
}

export const PageNavigation = ({
  setState,
  state,
  doc_id,
  viewFrontPage,
}: {
  setState: EditBookAction
  state: EditBookState
  doc_id: number
  viewFrontPage: VoidReturnFunction
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
              form: "add_chapter",
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
              <div style={{ width: "90%" }}>{chapter.title}</div>
            </PageNavContainer>
            <ChapterButtonNavContainer>
              <Button
                onClick={() => {
                  setState({
                    ...state,
                    topNode: chapter,
                    form: "add_chapter",
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
                      form: "add_section",
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
                            form: "add_section",
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
    </>
  )
}
