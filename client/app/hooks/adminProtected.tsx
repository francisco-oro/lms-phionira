import UserAuth from "./userAuth";
import { redirect } from "next/navigation";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
interface ProtectedProps  {
    children: React.ReactNode;
}


export default function AdminProtected({children}: ProtectedProps) {
    const {user} = useSelector((state: any) => state.auth);
    if (user) {
        const isAdmin = user?.role === "admin";
        return isAdmin ? children : redirect("/");   
    }
    return redirect("/");
    
}