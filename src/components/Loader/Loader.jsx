import "./Loader.css";
const Loader = () => {
  return (
    <div className="loaderContainer">
    <div className="loader">
      <div className="progress" data-percentage="100%"></div>
    </div>
    </div>
  );
};

export default Loader;
