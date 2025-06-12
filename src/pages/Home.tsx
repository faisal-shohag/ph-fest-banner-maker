import { Link } from "react-router";

const Home = () => {
    return (
        <div>
         <div className="text-3xl font-bold">Home</div>
            <Link to="/editor">Banner Editor</Link>
        </div>
    );
};

export default Home;