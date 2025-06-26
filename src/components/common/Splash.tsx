import { Loader2Icon } from "lucide-react";

const Splash = () => {
    return (
        <div className="fixed w-full h-full dark:bg-zinc-900 bg-white flex items-center justify-center">
          <div>
            <div className="animate-pulse pl-5"><img src="/icons/splash.png" alt="logo" className="w-32 h-32" /></div>
            <div className="text-2xl font-bold  flex items-center gap-1">
             <Loader2Icon className="animate-spin"/>
                Hero Canvas
                </div>
            
          </div>
        </div>
    );
};

export default Splash;