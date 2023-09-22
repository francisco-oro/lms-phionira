import { styles } from '@/app/styles/style';
import { read } from 'fs';
import React, {FC, useState} from 'react'
import Image from 'next/image';

type Props = {
  courseInfo:any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void; 
}

const CourseInformation:FC<Props> = ({courseInfo, setCourseInfo, active, setActive}) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader( );

      reader.onload = (e:any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result })
        }
      };
      reader.readAsDataURL(file);
    }
  }


  const handleDragOver = (e:any) => {
    e.preventDefault();
    setDragging(true);
  }

  const handleDragLeave = (e:any) => {
    e.preventDefault();
    setDragging(false);
  }

  const handleDrop = (e:any) => {
    e.preventDefault();
    setDragging(false);
  
    const file = e.dataTransfer.files?.[0];
    
    if (file) {
      const reader = new FileReader(); 
    
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result});
      };

      reader.readAsDataURL(file);
    }
  }


  return (
    <div className='w-[80%] m-auto mt-24'>
        <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="">Título del curso </label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="Matemáticas aplicadas para la venta de alcohol"
            className={`
            ${styles.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label className={`${styles.label}`}>Descripción</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Escribe una descripción increíble..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Precio del curso</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="4000"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Precio estimado (opcional)
            </label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="4500"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`} htmlFor="email">
              Etiquetas del curso
            </label>
            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="Alcoholismo, Matemáticas, Negocios, Finanzas, Emprendimiento"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Categoría 
            </label>
            <select
              name=""
              id=""
              className={`${styles.input}`}
              value={courseInfo.category}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option value="">Seleccione una categoría</option>
              <option value="">Categoría 1</option>
              {/* {categories &&
                categories.map((item: any) => (
                  <option value={item.title} key={item._id}>
                    {item.title}
                  </option>
                ))} */}
            </select>
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Nivel de complejidad</label>
            <input
              type="text"
              name=""
              value={courseInfo.level}
              required
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="level"
              placeholder="Principiante/Intermedio/Experto"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Url del Demo</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="eer74fd"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Arrastra y suelta aquí la portada o haz click para abrir el explorador de archivos
              </span>
            )}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Siguiente"
            className="w-full 800px:w-[180px] h-[40px] bg-[#9b5094] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
        <br />
        <br />
        </form>
    </div>
  )
}

export default CourseInformation