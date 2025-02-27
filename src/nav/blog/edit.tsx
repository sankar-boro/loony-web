import { BooleanDispatchAction, ReadBlogState } from "loony-types"
import { Chapters } from "./BlogPageNavigation.tsx"

export default function ViewNav(props: {
  setMobileNavOpen: BooleanDispatchAction
  state: ReadBlogState
}) {
  const { setMobileNavOpen, state } = props
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "rgb(0,0,0,0.5)",
        zIndex: 10,
        height: "105vh",
      }}
      onClick={() => {
        setMobileNavOpen(false)
      }}
    >
      <div
        style={{
          width: 320,
          backgroundColor: "white",
          maxWidth: "100%",
          height: "100%",
          position: "relative",
          padding: 12,
        }}
      >
        <Chapters state={state} />
      </div>
    </div>
  )
}
