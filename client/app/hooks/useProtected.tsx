import UserAuth from "./userAuth";
import { redirect } from "next/navigation";
interface ProtectedProps  {
    children: React.ReactNode;
}

export default function Protected({children}: ProtectedProps) {
    const isAuthenticated = UserAuth();

    return isAuthenticated ? children : redirect("/");
}