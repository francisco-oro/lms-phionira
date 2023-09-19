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
    email: Yup.string().email("La direcció de correo electrónico no es válida").required("Por favor ingresa tu dirección de correo electrónico"),
    password: Yup.string().required("Por favor ingresa tu conraseña").min(6),
});

const Login:FC<Props> = ({setRoute}) => {

    const [show, setShow] = useState(false);

    const formik = useFormik({
        initialValues: { email: "", password: ""}, 
        validationSchema: schema,
        onSubmit: async({email, password}) => {
            console.log(email, password);
        }
    });

    const {errors, touched, values,handleChange, handleSubmit} = formik;
  return (
    <div className='w-full'>
        <h1 className={`${styles.title}`}>
            Inicia sesión en Phionira
        </h1>
        <form  onSubmit={handleSubmit}>
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
                Ingresa tu conraseña
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
            {errors.password && touched.password && (
                <span className="text-red-500 pt-2 block">{errors.password}</span>
            )}
            </div>
            <div className="w-full mt-5">
                <input type="submit" value="Iniciar sesión" className={`${styles.button}`} />
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
             O inicia sesión con 
            </h5>
            <div className="flex items-center justify-center my-3">
            <FcGoogle size={30} className="cursor-pointer mr-2"
            onClick={() => signIn("google")}
            />
            <BiLogoFacebookCircle size={30} className="cursor-pointer fill-[#3b5998] ml-2" onClick={() => signIn("github")} />
            </div>
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
            ¿No tienes una cuenta?{" "}
            <span
                className="text-[#2190ff] pl-1 cursor-pointer"
                onClick={() => setRoute("Sign-Up")}
            >
                Regístrate
            </span>
            </h5>
        </form>
    </div>
  )
}

export default Login