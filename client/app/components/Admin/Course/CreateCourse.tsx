"use client";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent"
import CoursePreview from "./CoursePreview"
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {};

const CreateCourse = (props: Props) => {
  const [createCourse, {isLoading, isSuccess, error}] = useCreateCourseMutation();
  
  useEffect(() => {
    if (isSuccess) {
      toast.success("Curso creado exitosamente");
      redirect("/admin/all-courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isLoading, isSuccess, error]);
  
  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "Matemáticas aplicadas para la venta de alcohol",
    description: "Este curso te enseñará cómo aplicar conceptos matemáticos en el contexto de la venta de alcohol. Aprenderás cómo calcular márgenes de beneficio, realizar análisis de datos y tomar decisiones basadas en información numérica",
    price: "4000",
    estimatedPrice: "4500",
    tags: "Alcoholismo, Matemáticas, Negocios, Finanzas, Emprendimiento",
    level: "Intermedio",
    categories: "Matemáticas",
    demoUrl: "4e42a2cb571d4f0b9ff486c4cd1406dc",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([
    { title: "Mejora de habilidades de resolución de problemas" },
    { title: "Mejora de habilidades de pensamiento crítico" },
    { title: "Incremento de conocimientos en la materia" },
  ]);
  
  const [prerequisites, setPrerequisites] = useState([
    { title: "Comprensión básica de matemáticas" },
    { title: "Familiaridad con conceptos de programación" },
    { title: "Acceso a una computadora con conexión a internet" },
  ]);
  
    // Add sectionId to each video section object
  const [courseContentData, setCourseContentData] = useState([
  {
    sectionId: 1,
    videoUrl: "4e42a2cb571d4f0b9ff486c4cd1406dc",
    title: "Introducción al curso",
    description: "En esta sección, aprenderás sobre los objetivos del curso y lo que puedes esperar obtener al tomarlo.",
    videoSection: "Sección 1: Introducción",
    videoLength: "10:30",
    links: [
      {
        title: "Recursos adicionales",
        url: "https://ejemplo.com/recursos",
      },
    ],
    suggestion: "Si tienes alguna pregunta o necesitas más información, no dudes en contactar al instructor.",
  }
  ]);

  const [courseData, setCourseData] = useState({});
  const handleSubmit = async () => {
    // format benefits array
    const formattedBenefits = benefits.map((benefit) => ({title:benefit.title})); 
    // Format prerequsites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({title:prerequisite.title}));

    // format course content array
    const formattedCourseContentData = courseContentData.map((courseContent) => ({
      videoUrl: courseContent.videoUrl,
      title: courseContent.title,
      descrption: courseContent.description,
      videoSection: courseContent.videoSection,
      links: courseContent.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestion: courseContent.suggestion,
    }));

    // Prepare our data object 
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };

    setCourseData(data); 
  };

  const handleCourseCreate = async (e:any) => {
    const data = courseData;

    if (!isLoading) {
      await createCourse(data);
    }
  }
  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            active={active}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            isEdit={false}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;
