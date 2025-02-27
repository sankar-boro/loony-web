import { ReadBlogState } from "loony-types"
import { Chapters } from "./BlogPageNavigation.tsx"

export default function ViewNav(props: { state: ReadBlogState }) {
  const { state } = props
  return (
    <div className="con-xxl-2 bor-right pad-top-15">
      <Chapters state={state} />
    </div>
  )
}
