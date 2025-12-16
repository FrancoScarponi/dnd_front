import { useDispatch, useSelector } from "react-redux";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import {
  authStart,
  authSuccess,
  authError,
  initSession,
  logout,
} from "../redux/slices/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import { fetchBackendUser, registerBackendUser } from "../api/user";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(authStart());

      const res = await signInWithEmailAndPassword(auth, email, password);
      
      const token = await res.user.getIdToken();
      console.log(token)
      const user = await fetchBackendUser(token);  

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(authSuccess({ user, token }));
    } catch (err) {
      let message = "Error al iniciar sesión";
      if (err instanceof Error) {
        message = err.message;
      }
      dispatch(authError(message));
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      dispatch(authStart());
      
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      if (!res.user) throw new Error("No se pudo crear el usuario");

      await updateProfile(res.user, {
        displayName: displayName,
      });
      
      const user = await registerBackendUser(email, password, displayName);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(authSuccess({ user: user, token }));
    } catch (err) {
      let message = "Error al registrar usuario";
      if (err instanceof Error) message = err.message;
      dispatch(authError(message));
    }
  };

  const initFromStorage = () => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      dispatch(initSession({ user: null, token: null }));
      return;
    }

    dispatch(initSession({ user: JSON.parse(userRaw), token }));
  };

  const logoutUser = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  return {
    ...authState,
    login,
    initFromStorage,
    logoutUser,
    register
  };
}
