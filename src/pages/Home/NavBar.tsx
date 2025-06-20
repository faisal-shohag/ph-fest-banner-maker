import AvatarDisplay from "@/components/common/AvatarDisplay";
import { AuthContext } from "@/contexts-providers/auth-context";
import { use } from "react";
import { BiSolidWidget } from "react-icons/bi";
import { MdTimelapse } from "react-icons/md";
import { Link } from "react-router";
import { FaHandshakeAngle } from "react-icons/fa6";
const NavBar = () => {
  const { user } = use(AuthContext) as any;

  const navlinks = [
    {
      title: "Templates",
      icon: <BiSolidWidget />,
      link: "/templates",
    },
    {
      title: "Recent Canvas",
      icon: <MdTimelapse />,
      link: "/recent-canvas",
    },
    {
      title: "Contribute",
      icon: <FaHandshakeAngle />,
      link: "/contribute",
    },
  ];

  return (
    <nav className="">
      <div className="line-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-200/20 dark:border-purple-500/20 rounded-xl px-4 py-2 flex justify-between">
        <div></div>

        <div className="flex gap-5">
          {navlinks.map((link, index) => {
            return (
              <div key={index + 1123}>
                <Link className="flex items-center gap-2 backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-2xl border border-white/30 dark:border-white/10 py-1 px-3 shadow-xl" to={link.link}>
                  <div>
                    {link.icon}
                  </div>

                  <div> {link.title}</div>
                </Link>
              </div>
            );
          })}
        </div>

        <div>
          {user ? (
            <div>
              <AvatarDisplay user={user} />
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
