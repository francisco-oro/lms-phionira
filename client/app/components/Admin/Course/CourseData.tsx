import React, {FC} from 'react'
import { styles } from '@/app/styles/style'
import {AiOutlinePlusCircle} from "react-icons/ai";
import toast from 'react-hot-toast';

type Props = {
  benefits: {title: string}[];
  setBenefits: (benefits: {title: string}[]) => void;
  prerequisites: {title: string}[];
  setPrerequisites: (prerequisites: {title: string}[]) => void; 
  active: number; 
  setActive: (active: number) => void; 
}


const CourseData:FC<Props> = ({
  benefits,
  setBenefits, 
  prerequisites,
  setPrerequisites,
  active,
  setActive
}) => {


  const handleBenefitChange = (index: number, value:any) =>  {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  }


  const handleAddBenefit = () => {
    setBenefits([...benefits, {title: ""}]);
  }

  const handlePrerequisitesChange = (index: number, value:any) =>  {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setBenefits(updatedPrerequisites);
  }


  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, {title: ""}]);
  }


  const prevButton = () => {
    setActive(active - 1);
  }

  const handleOptions = () => {
    if (benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
      setActive(active + 1);
    } else{
        toast.error("Por favor llena todo los campos para proceder a la siguiente sección")
    }
  };


  return (
    <div className='w-[80%] m-auto mt-24 black'>
        <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          ¿Cuáles son los aprendizajes esperados de este curso?
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text" 
            key={index}
            name="Benefit"
            placeholder="Tendrás las habilidades necesarias para entrar a la carrera de tus sueños"
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
        </div>
        <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          ¿Cuáles son los requisitos recomendados? 
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text" 
            key={index}
            name="prerequisites"
            placeholder="Conocimiento básico de bebidas"
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisite}
        />
        </div>
        <div className="w-full flex items-center justify-between">
      <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#9b5094] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Anterior
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#9b5094] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Siguiente
        </div>
      </div>
    </div>
  )
}

export default CourseData;