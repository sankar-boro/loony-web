import PageLoader from "./PageLoader";

const PageLoadingContainer = () => {
  return (
    <div className="book-container">
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        <div
          style={{
            width: "20%",
            paddingTop: 15,
            borderRight: "1px solid #ebebeb",
          }}
        />
        <div
          style={{
            width: "100%",
            paddingTop: 15,
            paddingLeft: "5%",
            background: "linear-gradient(to right, #ffffff, #F6F8FC)",
            paddingBottom: 50,
          }}
        >
          <PageLoader key_id={1} />
        </div>
      </div>
    </div>
  );
};

export default PageLoadingContainer;
