import Image from "next/image";
import { styles } from "../../../app/styles/style";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";
import { useUpdateAvatarMutation, useEditProfileMutation } from "@/redux/features/user/userApi";
import { formatDate } from "../../utils/profileUtils";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState(user && formatDate(user.dateOfBirth));
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  console.log(user);
  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        console.log(typeof(avatar));
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };


  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(error);
      if(updateError){
        if ("data" in updateError) {
          const errorData = updateError as any; 
          toast.error(errorData.data.message); 
        }
      }
    }

    if (success) {
      toast.success("Datos actualizados exitosamente");
    }
    if (error) {

  }

  }, [isSuccess, error, success, updateError])


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name, phoneNumber, dateOfBirth
      })
    }
  };
    

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#4c0615] dark:border-[#9b5094] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2 dark:text-white text-black">
                Nombre completo
              </label>
              <input
                name="name"
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => {setName(e.target.value); console.log(e.target.value)}}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">
                Dirección de correo electrónico
              </label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={user?.email}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">
                Número telefónico
              </label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">
                Fecha de nacimiento
              </label>
              {/* Date of birth not showing up on the client side */}
              <input
                type="date"
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-[#4c0615] dark:border-[#9b5094] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Actualizar"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
