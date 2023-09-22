'use client'
import React, {FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Protected from '../hooks/useProtected'
import Profile from "../components/Profile/Profile"
import { useSelector } from "react-redux";

type Props = {}

const Page:FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(6);
    const [route, setRoute] = useState("Login"); 
    const {user} = useSelector((state:any) => state.auth);
  return (
    <div>
        <Protected>
        <Heading
      title={`Perfil de ${user?.name} - Phionira`}
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
      <Profile user={user}/>
        </Protected>

    </div>
  )
}

export default Page