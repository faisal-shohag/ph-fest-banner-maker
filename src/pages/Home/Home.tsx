import RecentCanvas from "./RecentCanvas";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TemplateShowcase from "./TemplateShowcase";
import CreateBrandNewCanvas from "@/components/common/CreatBrandNewCanvas";
import { Link } from "react-router";
export default function Home() {
  return (
    <div className={`transition-colors duration-500  `}>
   
        <section className="flex  pt-5">
          <div className="flex flex-col items-center gap-5  g-card rounded-2xl  py-5 w-screen  text-center">
            <div className="font-bold text-3xl">
              Create, Inspire and Explore...
            </div>

            <Link to={'/templates'}>
            <div className="relative">
              <span className="absolute left-0 h-full flex justify-center items-center pl-2"><Search/></span>
              <Input className="pl-10" type="text" placeholder="Search from templates..."/>
            </div>
            </Link>

            <div>
              <CreateBrandNewCanvas />
            </div>
          </div>
        </section>

        <RecentCanvas/>

        <TemplateShowcase/>

    </div>
  );
}
