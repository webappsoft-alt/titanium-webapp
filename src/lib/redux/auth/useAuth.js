import { useSelector } from "react-redux";

export const useAuth = () => {
    const isLogin = useSelector((state) => state.auth.isLogin)
    if (isLogin) {
        return true;
    } else {
        return false
    }
};