import AvatarDisplay from "@/components/common/AvatarDisplay";
import { AuthContext } from "@/contexts-providers/auth-context";
import { use } from "react";
import { BiSolidWidget } from "react-icons/bi";
import { Link, useLocation } from "react-router";
import { FaHandshakeAngle } from "react-icons/fa6";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { RiHomeFill } from "react-icons/ri";
import { HiColorSwatch } from "react-icons/hi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
const NavBar = () => {
  const { user, logout } = use(AuthContext) as any;
  const location = useLocation()
  const navlinks = [
     {
      title: "Home",
      icon: <RiHomeFill />,
      link: "/",
      active:location.pathname.length == 1
    },
    {
      title: "Templates",
      icon: <BiSolidWidget />,
      link: "/templates",
      active: location.pathname.includes("/templates")
    },
      {
      title: "My Canvas",
      icon: <HiColorSwatch />,
      link: "/my-canvas",
      active: location.pathname.includes("/my-canvas")
    },
    {
      title: "Contribute",
      icon: <FaHandshakeAngle />,
      link: "/contribute",
        active: location.pathname.includes("/contribute")
    },
  ];

  return (
    <nav className=" mb-5 border-b">
      <div className="line-flex items-center space-x-2 rounded-xl px-4 py-2 flex justify-between">
        <div className="flex items-center gap-2 text-lg font-bold">

            <div className="block md:hidden lg:hidden xl:hidden">
              <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'icon'} variant={'outline'} className="">
                        <MenuIcon/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                     {
                      navlinks.map((link, index) =>  <DropdownMenuItem key={index+1233}>
                        <Link to={link.link}>{link.title}</Link>
                      </DropdownMenuItem>)
                     }
                     
                    </DropdownMenuContent>
                  </DropdownMenu>
         
            </div>

          <div className="flex items-center gap-2">
            <img className="h-10" src="/icons/splash.png" alt="logo"/>
          Hero Canvas
          </div>
        </div>

        <div className="lg:flex xl:flex md:flex hidden gap-5">
          {navlinks.map((link, index) => {
            return (
              <div className={`text-muted-foreground font-medium px-5 py-1 rounded-xl text-sm ${link.active && 'g-card'}`} key={index + 1123}>
                <Link className="flex items-center gap-2 " to={link.link}>
                  <div>
                    {link.icon}
                  </div>

                  <div> {link.title}</div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div>
               <DropdownMenu>
                    <DropdownMenuTrigger>
                      
                          <AvatarDisplay user={user} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        {user.displayName}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem
                        onClick={() => logout()}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                      >
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
         
            </div>
          ) : null}

          <ThemeToggle/>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
