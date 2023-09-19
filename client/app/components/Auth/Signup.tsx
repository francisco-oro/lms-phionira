import React, { FC } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
import { BiLogoFacebookCircle } from 'react-icons/bi';
import {FcGoogle} from "react-icons/fc";
import { useState } from 'react';
import { styles } from '../../../app/styles/style';

type Props = {
    setRoute: (route: string ) => void; 
}

const schema = Yup.object().shape({
    name: Yup.string().required("Por favor ingresa tu nombre"),
    email: Yup.string()
      .email("¡El email proporcionado no es válido!")
      .required("Por favor ingresa tu email "),
    password: Yup.string().required("Por favor ingresa tu contraseña").min(6, "La contraseña debe tener al menos 6 caracteres ")
  });

const SignUp:FC<Props> = ({setRoute}) => {

    const [show, setShow] = useState(false);

    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({name, email, password }) => {
          const data = {
            name,email,password
          };
          setRoute("Verification");
        },
      });
    

    const {errors, touched, values,handleChange, handleSubmit} = formik;
  return (
    <div className='w-full'>
        <h1 className={`${styles.title}`}>
            Únete a Phionira 
        </h1>
        <form  onSubmit={handleSubmit}>
            <div className="mb-3">
            <label
            htmlFor='name'
            className={`${styles.label}`}
            >
                Ingresa tu nombre      
            </label>
            <input
                type="text"
                name=""
                value={values.name}
                onChange={handleChange}
                id="name"
                placeholder="Maor Thamina"
                className={`${errors.name && touched.email && "border-red-500"} ${
                    styles.input
                }`}
            />
            {errors.name && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
            )}
            </div>


            <label
            htmlFor='email'
            className={`${styles.label}`}
            >
                Ingresa tu email     
            </label>
            <input
                type="email"
                name=""
                value={values.email}
                onChange={handleChange}
                id="email"
                placeholder="ejemplo@dominio.com"
                className={`${errors.email && touched.email && "border-red-500"} ${
                    styles.input
                }`}
            />
            {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
            )}

            <div className="w-full mt-5 relative mb-1">
            <label className={`${styles.label}`} htmlFor="email">
                Ingresa tu contraseña
            </label>
            <input
                type={!show ? "password" : "text"}
                name="password"
                value={values.password}
                onChange={handleChange}
                id="password"
                placeholder="Contraseña"
                className={`${
                errors.password && touched.password && "border-red-500"
                } ${styles.input}`}
            />
            {!show ? (
                <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(true)}
                />
            ) : (
                <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShow(false)}
                />
            )}
            </div>
            {errors.password && touched.password && (
                <span className="text-red-500 pt-2 block">{errors.password}</span>
            )}
            <div className="w-full mt-5">
                <input type="submit" value="Crear cuenta" className={`${styles.button}`} />
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
             O regístrate con 
            </h5>
            <div className="flex items-center justify-center my-3">
            <FcGoogle size={30} className="cursor-pointer mr-2"
            onClick={() => signIn("google")}
            />
            <BiLogoFacebookCircle size={30} className="cursor-pointer fill-[#3b5998] ml-2" onClick={() => signIn("github")} />
            </div>
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
            ¿Ya tienes una cuenta?{" "}
            <span
                className="text-[#2190ff] pl-1 cursor-pointer"
                onClick={() => setRoute("Login")}
            >
                Inicia sesión
            </span>
            </h5>
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
            ¿Has recibido el email?{" "}
            <span
                className="text-[#2190ff] pl-1 cursor-pointer"
                onClick={() => setRoute("Verification")}
            >
                Verifica tu cuenta
            </span>
            </h5>
        </form>
    </div>
  )
}

export default SignUp;