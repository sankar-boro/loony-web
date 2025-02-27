import PageLoader from "./PageLoader.tsx"

const PageLoadingContainer = ({
  isMobile,
  title,
}: {
  isMobile: boolean
  title?: string
}) => {
  return (
    <div className="full-con">
      <div style={{ display: "flex", flexDirection: "row" }}>
        {isMobile ? null : <div className="con-xxl-2 bor-right pad-top-15" />}
        <div className="con-sm-12 con-xxl-5 mar-hor-1">
          {title ? <h1>{title}</h1> : null}
          <PageLoader key_id={1} />
        </div>
        {isMobile ? null : (
          <div
            style={{
              width: "20%",
              paddingTop: 15,
              borderRight: "1px solid #ebebeb",
            }}
          />
        )}
      </div>
    </div>
  )
}

export default PageLoadingContainer
