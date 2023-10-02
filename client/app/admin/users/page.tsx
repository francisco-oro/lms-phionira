"use client";
import React from "react";
import Heading from "@/app/utils/Heading";
import AdminProtected from "@/app/hooks/adminProtected";
import AdminSideBar from "../../components/Admin/Sidebar/AdminSideBar";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AllUsers from "../../components/Admin/Course/AllUsers"

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
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSideBar />
          </div>
          <div className="w-[85%]">
            <DashboardHero/>
            <AllUsers/>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
