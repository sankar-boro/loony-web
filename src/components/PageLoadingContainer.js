import PageLoader from "./PageLoader";

const PageLoadingContainer = () => {
  return (
    <div className="book-container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: "20%",
            paddingTop: 15,
            borderRight: "1px solid #ebebeb",
          }}
        />
        <div
          style={{
            width: "50%",
            paddingTop: 15,
            paddingLeft: "5%",
            paddingRight: "5%",
            background: "linear-gradient(to right, #ffffff, #F6F8FC)",
            minHeight: "100vh",
          }}
        >
          <PageLoader key_id={1} />
        </div>
        <div
          style={{
            width: "20%",
            paddingTop: 15,
            borderRight: "1px solid #ebebeb",
          }}
        />
      </div>
    </div>
  );
};

export default PageLoadingContainer;
