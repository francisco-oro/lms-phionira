"use client"
import React, {FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import {motion} from "framer-motion";

interface Props {}

const Page: FC<Props> = (props)   => { 
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login"); 
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0, 
  })

  console.log(mousePosition);

  useEffect(() => {
    const mouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    }
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    }
  }
  return(
    <div>
      <motion.div className='cursor'
      variants={variants}
      animate="default"
      />
      <Heading
      title="Phionira"
      description="Phionira es una plataforma de aprendizaje para ayudar a los estudiantes a acreditar su examen de admisión en la UAEMéx con asesoría de profesores con amplia experiencia en el área"
      keywords="Curso UAEMéx, Inglés, Programación, React, SQL, Full-stack development"
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setRoute={setRoute}
      route={route}
      />
      <Hero/>
    </div>
  )
};

export default Page; 