import NavBar from "@/pages/Home/NavBar";
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div className="max-w-7xl mx-auto px-3 lg:px-0">
                 <NavBar/>
            <Outlet/>
        </div>
    );
};

export default MainLayout;