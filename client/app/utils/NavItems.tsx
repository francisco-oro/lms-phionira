import Link from "next/link";
import React from "react";
import { Icons } from "../components/Icons";

export const navItemsData = [
  {
    name: "Inicio",
    url: "/",
  },
  {
    name: "Cursos",
    url: "/courses",
  },
  {
    name: "Nosotros",
    url: "/about",
  },
  {
    name: "Políticas",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
    return (
      <>
        <div className="hidden 800px:flex">
          {navItemsData &&
            navItemsData.map((i, index) => (
              <Link href={`${i.url}`} key={index} passHref>
                <span
                  className={`${
                    activeItem === index
                      ? "dark:text-[#388697] text-[#6667ab]"
                      : "dark:text-white text-black"
                  } text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {i.name}
                </span>
              </Link>
            ))}
        </div>
        {isMobile && (
          <div className="800px:hidden mt-5">
               <div className="w-full text-center py-6">
              <Link href={"/"} passHref>
                <span
                  className={`text-[25px] mx-auto font-Poppins font-[500] text-black dark:text-white`}
                ><Icons.phionira.rectangle/></span>
              </Link>
            </div>
              {navItemsData &&
                navItemsData.map((i, index) => (
                  <Link href="/" passHref key={index}>
                    <span
                      className={`${
                        activeItem === index
                          ? "dark:text-[#388697] text-[#6667ab]"
                          : "dark:text-white text-black"
                      } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                    >
                      {i.name}
                    </span>
                  </Link>
                ))}
            </div>
        )}
      </>
    );
  };
  
  export default NavItems;
  