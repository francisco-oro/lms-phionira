'use client'
import React from 'react'
import AdminSidebar from "../../components/Admin/Sidebar/AdminSideBar";
import Heading from '../../../app/utils/Heading';
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from '@/app/components/Admin/DashboardHeader';

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Heading
          title="Phionira - Administrador"
          description="Phionira es una plataforma de aprendizaje para ayudar a los estudiantes a acreditar su examen de admisión en la UAEMéx con asesoría de profesores con amplia experiencia en el área"
          keywords="Curso UAEMéx, Inglés, Programación, React, SQL, Full-stack development"
        />
        <div className='flex'>
          <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar/>
          </div>
          <div className='w-[85%]'>
            <DashboardHeader/>
            <CreateCourse/>
          </div>
        </div>
    </div>
  )
}

export default page