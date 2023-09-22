"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminSideBar from "../components/Admin/Sidebar/AdminSideBar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from  "../components/Admin/DashboardHero"

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Phionira - Administrador"
          description="Phionira es una plataforma de aprendizaje para ayudar a los estudiantes a acreditar su examen de admisión en la UAEMéx con asesoría de profesores con amplia experiencia en el área"
          keywords="Curso UAEMéx, Inglés, Programación, React, SQL, Full-stack development"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSideBar />
          </div>
          <div className="w-[85%]">
            <DashboardHero/>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
