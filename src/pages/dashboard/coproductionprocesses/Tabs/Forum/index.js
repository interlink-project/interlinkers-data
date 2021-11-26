
const Forum = () => {
    return true ? <iframe src="http://localhost/forum/index" style={{ width: "100%", height: "85vh" }} frameBorder="0">Browser not compatible.</iframe> : <iframe src="http://localhost:3001" style={{ width: "100%", height: "85vh" }} frameBorder="0">Browser not compatible.</iframe>
};

export default Forum;
