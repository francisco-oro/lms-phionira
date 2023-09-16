"use client"
import React, {FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

interface Props {}

const Page: FC<Props> = (props)   => { 
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  return(
    <div>
      <Heading
      title="Phionira"
      description="Phionira es una plataforma de aprendizaje para ayudar a los estudiantes a acreditar su examen de admisión en la UAEMéx con asesoría de profesores con amplia experiencia en el área"
      keywords="Curso UAEMéx, Inglés, Programación, React, SQL, Full-stack development"
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      />
      <Hero/>
    </div>
  )
};

export default Page; 