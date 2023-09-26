import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { styles } from "@/app/styles/style";
import { BiSolidPencil } from "react-icons/bi";
import BSLink45Deg, { BsLink45Deg } from "react-icons/bs";
import toast from "react-hot-toast";


type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};



const CourseContent: FC<Props> = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handleCourseSubmit,
}) => {

  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );

  const [activeSection, setActiveSection] = useState(1);

  // Pass sectionId to handlecollapsetoggle
  const handleCollapseToggle = (index: number, sectionId: number) => {
    const updatedCollapsed = [...isCollapsed];
    const index_1 = courseContentData.findIndex((item:any) => item.sectionId === sectionId)
    if (index !== -1) {
      updatedCollapsed[index] = !updatedCollapsed[index];
      setIsCollapsed(updatedCollapsed); 
    }
  };

  const handleRemoveLink = (index: number, linkindex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkindex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", link: "" });
    setCourseContentData(updatedData);
    console.log(updatedData);
    console.log(courseContentData);
  };

  const handleSubmit  = async () => {
    // Format benefits array
  }
  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === "" 
    ) {
      toast.error("Por favor llena todos los campos primero");
    } else {
      let newVideoSection = "";

      if (courseContentData.length > 0 ) {
        const lastVideoSection = courseContentData[courseContentData.length -  1].videoSection;

        // Use the last videoSection if available, else user input
        if (lastVideoSection) {
          newVideoSection = lastVideoSection         
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        links: [{title: "", url: ""}]
      };
      setCourseContentData([...courseContentData, newContent])
    }
  }

  const addNewSection = () => {
    if (courseContentData[courseContentData.length - 1].title === "" || courseContentData[courseContentData.length - 1].descripción === "" || courseContentData[courseContentData.length - 1].videoUrl === "" || courseContentData[courseContentData.length - 1].links[0].title === "" || courseContentData[courseContentData.length - 1].links[0].url === "") {
      toast.error("Por favor llena todos los campos requeridos");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        title: "",
        description: " ",
        videoSection: `Sección sin título ${activeSection}`,
        links: [{title: "", url: ""}]
      }

      setCourseContentData([...courseContentData, newContent]);
    }
  }

  const prevButton = () => {
    setActive(active - 1);
  }

  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Ninguna sección puede estar vacía");
    } else {
      setActive(active + 1);
      handleCourseSubmit();
    }
  }

  // Update videosection property of related video sections 
  const handleSectionTitleChange = (sectionId: number, newTitle: string) => {
    const updatedData = [...courseContentData];
    const sectionsToUpdate = updatedData.filter((item:any) => item.sectionId === sectionId);

    sectionsToUpdate.forEach((section: any) => {
      section.videoSection = newTitle
      setCourseContentData(updatedData);
    })
  }

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map
        ((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <>
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
              >
                {showSectionInput && (
                  <>
                    <div className="flex w-full items-center">
                      <input
                        type="text"
                        className={`text-[20px] ${
                          item.videoSection === "Untitled Section"
                            ? "w-[170px]"
                            : "w-min"
                        } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                        value={item.videoSection}
                        onChange={(e) => {
                          handleSectionTitleChange(item.sectionId, e.target.value);
                        }}
                      />
                      <BiSolidPencil className="cursor-pointer dark:text-white text-black" />
                    </div>
                    <br />
                  </>
                )}
                <div className="flex w-full items-center justify-between my-0">
                  {isCollapsed[index] ? (
                    // Not adding new videosections when newContentHandler is called
                    <>
                      {item.title ? (
                        <p className="font-Poppins dark:text-white text-black">
                          {index + 1}. {item.title}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div></div>
                  )}

                  {/* Arrow button for collapsed video content */}
                  <div className="flex items-center">
                    <AiOutlineDelete
                      className={`dark:text-white text-[20px] mr-2 text-black ${
                        index > 0 ? "cursor-pointer" : "cursor-no-drop"
                      }`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = [...courseContentData];
                          updatedData.splice(index, 1);
                          setCourseContentData(updatedData);
                        }
                      }}
                    />
                    <MdOutlineKeyboardArrowDown
                      fontSize="large"
                      className="dark:text-white text-black cursor-pointer"
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      // Update isCollapsed state based on sectionID
                      onClick={() => handleCollapseToggle(index, item.sectionId)}
                    />
                  </div>
                </div>
                {!isCollapsed[index] && (
                  <>
                    <div className="my-3">
                      <label className={styles.label}>Título del video</label>
                      <input
                        type="text"
                        placeholder="Plan del curso..."
                        className={`${styles.input}`}
                        value={item.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className={styles.label}>Enlace del video</label>
                      <input
                        type="text"
                        placeholder="https://www.phionira.com/videos/sample-id-no-name"
                        className={`${styles.input}`}
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoUrl = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className={styles.label}>
                        Descripción del video
                      </label>
                      <textarea
                        rows={8}
                        cols={30}
                        placeholder="1. Sé conciso (a): La descripción debe ser fácil de leer, por lo que no debe superar unas pocas frases, 
                      2. Utiliza palabras clave: asegúrate de incluir palabras clave relevantes en la descripción,
                      3. Escribe una frase inicial atractiva: Capta la atención del espectador desde el principio con una frase que despierte su interés"
                        className={`${styles.input} !h-min py-2`}
                        value={item.description}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].description = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <br />
                    </div>
                    {item?.links.map((link: any, linkIndex: number) => {
                      return (
                        <div className="mb-3 block" key={linkIndex}>
                          <div className="w-full flex items-center justify-center">
                            <label className={`${styles.label}`}>
                              Recurso {linkIndex + 1}
                            </label>
                            <AiOutlineDelete
                              className={`dark:text-white text-[20px] mr-2 text-black ${
                                linkIndex === 0 ? "cursor-pointer" : "cursor-no-drop"
                              } text-black dark:text-white text-[20px]`}
                              onClick={() =>
                                linkIndex === 0 ? null : handleRemoveLink(index, linkIndex)
                              }
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Recurso adicional... (Link del video)"
                            className={`${styles.input}`}
                            value={link.title}
                            onChange={(e) => {
                              const updatedData = [...courseContentData];
                              updatedData[index].links[linkIndex].title = e.target.value;
                              setCourseContentData(updatedData);
                            }}
                          />
                          <input
                            type="url"
                            placeholder="Enlace del recurso adicional (URL)"
                            className={`${styles.input}`}
                            value={link.url}
                            onChange={(e) => {
                              const updatedData = [...courseContentData];
                              updatedData[index].links[linkIndex].url = e.target.value;
                              setCourseContentData(updatedData);
                            }}
                          />
                        </div>
                      );
                    })}
                    <br />
                    {/* Add link button  ---working fine*/}
                    <div className="inline-block mb-4">
                      <p 
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                      onClick={(e:any) => {handleAddLink(index); console.log(item?.links)}}
                      >
                        <BsLink45Deg className="mr-2" /> Agregar un recurso

                      </p>
                    </div>
                  </>
                )}
                <br />
                 {/* Add neew content -- not adding a new */}
                 {index === courseContentData.length - 1 && (
                  <div>
                    <p
                    onClick={(e:any) => {newContentHandler(item)}} 
                    className="flex items-center text-[18px] dark:text-white text-black cursor-pointer">
                      <AiOutlinePlusCircle className="mr-2"/> Agregar un nuevo contenido
                    </p>  
                  </div>
                 )}
              </div>
            </>
          );
        })}
        <br />
        <div
        className="flex items-center text-[20px] dark:text-white text-black cursor-pointer"
        onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2"/> Agregar una nueva sección 
        </div>
      </form>
      <br />
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
    <br />
    <br />
    <br />
    </div>
  );
};

export default CourseContent;
