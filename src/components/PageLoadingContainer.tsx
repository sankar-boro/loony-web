import PageLoader from "./PageLoader.tsx";

const PageLoadingContainer = ({
  isMobile,
  title,
}: {
  isMobile: boolean;
  title?: string;
}) => {
  return (
    <div className="full-con">
      <div style={{ display: "flex", flexDirection: "row" }}>
        {isMobile ? null : (
          <div
            style={{
              width: "15%",
              paddingTop: 15,
              borderRight: "1px solid #ebebeb",
            }}
          />
        )}
        <div className="con-40 margin-hor-5">
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
  );
};

export default PageLoadingContainer;
