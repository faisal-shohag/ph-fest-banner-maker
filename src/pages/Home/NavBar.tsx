import AvatarDisplay from "@/components/common/AvatarDisplay";
import { AuthContext } from "@/contexts-providers/auth-context";
import { use } from "react";
import { BiSolidWidget } from "react-icons/bi";
import { Link, useLocation } from "react-router";
import { FaHandshakeAngle } from "react-icons/fa6";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { RiHomeFill } from "react-icons/ri";
const NavBar = () => {
  const { user } = use(AuthContext) as any;
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
      title: "Contribute",
      icon: <FaHandshakeAngle />,
      link: "/contribute",
        active: location.pathname.includes("/contribute")
    },
  ];

  return (
    <nav className=" mb-5 border-b">
      <div className="line-flex items-center space-x-2 rounded-xl px-4 py-2 flex justify-between">
        <div className="flex items-center gap-2 text-lg font-medium">
          <img className="h-10" src="/icons/splash.png" alt="logo"/>
          Hero Canvas
        </div>

        <div className="flex gap-5">
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
              <AvatarDisplay user={user} />
            </div>
          ) : null}

          <ThemeToggle/>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
