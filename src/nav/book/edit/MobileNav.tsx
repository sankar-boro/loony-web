import {
  EditBookAction,
  EditBookState,
  VoidReturnFunction,
  BooleanDispatchAction,
} from "loony-types"
import { PageNavigation } from "./editPageNavigation"
import { LuFileWarning } from "react-icons/lu"
import { FiEdit2 } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function MobileNav(props: {
  state: EditBookState
  setState: EditBookAction
  doc_id: number
  setMobileNavOpen: BooleanDispatchAction
  viewFrontPage: VoidReturnFunction
  mobileNavOpen: boolean
}) {
  const {
    mobileNavOpen,
    setMobileNavOpen,
    setState,
    state,
    doc_id,
    viewFrontPage,
  } = props
  if (!mobileNavOpen) return null

  return (
    <>
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
          <PageNavigation
            setState={setState}
            state={state}
            doc_id={doc_id as number}
            viewFrontPage={viewFrontPage}
          />

          <div
            style={{
              marginTop: 20,
              borderTop: "1px solid #ccc",
              paddingTop: 12,
            }}
          >
            <ul
              className="list-item"
              style={{ paddingLeft: 0, listStyle: "none" }}
            >
              <li style={{ display: "flex", alignItems: "center" }}>
                <FiEdit2 color="#2d2d2d" size={16} />
                <Link to={`/view/book/${doc_id}`}>Read Book</Link>
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <LuFileWarning color="#2d2d2d" size={16} />
                <Link to="#">Report</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
