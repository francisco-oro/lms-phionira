import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "@/app/styles/style";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";


type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit: boolean;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
  isEdit,
}) => {
  const dicountPercentenge =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate();
  };

  return (
    <div className="w-[90%] m-auto py-5 mb-5 dark:text-white text-black">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px] text-black dark:text-white">
            {courseData?.price === 0 ? "Free" : courseData?.price + ".00 MXN"}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
            {courseData?.estimatedPrice}.00 MXN
          </h5>

          <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
            {discountPercentengePrice}% Off
          </h4>
        </div>

        <div className="flex items-center">
          <div
            className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-secondary-400 cursor-not-allowed`}
          >
            Comprar Ahora {courseData?.price}.00 MXN
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Cupón de Descuento"
            className={`${styles.input} 1500px:!w-[50%] 1100px:w-[60%] ml-3 !mt-0`}
          />
          <div
            className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer text-white`}
          >
            Aplicar
          </div>
        </div>
        <p className="pb-1 flex flex-row items-center"><AiOutlineCheckCircle className={"text-secondary-400 mx-3"}/> Acompañamiento psicológico</p>
        <p className="pb-1 flex flex-row items-center"><AiOutlineCheckCircle className={"text-secondary-400 mx-3"}/> Estudia a tu propio ritmo</p>
        <p className="pb-1 flex flex-row items-center"><AiOutlineCheckCircle className={"text-secondary-400 mx-3"}/> Exámenes simulacro</p>
        <p className="pb-3 flex flex-row items-center 800px:pb-1"><AiOutlineCheckCircle className={"text-secondary-400 mx-3"}/> Clases en vivo</p>
        <p className="pb-3 flex flex-row items-center 800px:pb-1"><AiOutlineCheckCircle className={"text-secondary-400 mx-3"}/> Bancos de preguntas</p>
        <p className="pb-3 flex flex-row items-center 800px:pb-1"><AiOutlineCheckCircle className={"text-secondary-400 mx-3"}/> 40,000 Horas de video</p>
      </div>
      <div className="w-full ">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600]">
            {courseData?.name}
          </h1>
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5>0 Reseñas</h5>
            </div>
            <h5>0 Estudiantes</h5>
          </div>
          <br />
          <h1 className="text-[25px] font-Poppins font-[600]">
            ¿Qué aprenderás en este curso? 
          </h1>
        </div>
        {courseData?.benefits?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        <h1 className="text-[25px] font-Poppins font-[600]">
          ¿Cuáles son los requisitos del curso? 
        </h1>
        {courseData?.prerequisites?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        {/* course description */}
        <div className="w-full">
          <h1 className="text-[25px] font-Poppins font-[600]">
            Acerca del curso
          </h1>
          <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden">
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-secondary-400 text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Anterior
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-secondary-400 text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => createCourse()}
        >
         {
          isEdit ? 'Anterior' : 'Publicar'
         }
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
