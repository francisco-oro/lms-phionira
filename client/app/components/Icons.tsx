import Image from "next/image"
  export const Icons = {
    phionira:{ 
      rectangle : ({ ...props }) => (
      <div>
        <Image src="https://res.cloudinary.com/dejepmxba/image/upload/v1693689243/rectangle_dark_no-bg_4x.png" 
        alt="phionira-logo"
        width={150}
        height={120}
        className='flex dark:hidden'
        />
  
        {/* Light Image */}
        <Image src="https://res.cloudinary.com/dejepmxba/image/upload/v1693689243/rectangle_light_no-bg_4x_.png" 
        alt="phionira-logo"
        width={150}
        height={120}
        className='hidden dark:flex md:hidden'
        />
      </div>
    ),    
    },
  }
  