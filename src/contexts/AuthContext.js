import { useState, useContext, createContext, useEffect } from "react";
import { getTokens, refreshTokens } from "../api/jwt";
import { jwtDecode } from "jwt-decode";
import AlertModal from "../components/Dashboard/UIComponents/Modals/AlertModal";

const AuthContext = createContext();
export default AuthContext;
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, ...props }) {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [authUser, setAuthUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState();
  const [openError, setOpenError] = useState(false);

  const isTokenExpired = (token) => {
    if (!token) {
      return true;
    }
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp < currentTime;
  };

  let loginUser = async (e) => {
    e.preventDefault();
    getTokens({
      username: e.target.username.value,
      password: e.target.password.value,
    }).then((res) => {
      if (typeof res.access !== "string") {
        //Display error Message
        setErrMsg("Incorrect username or password. Please try again.");
        setOpenError(true);
        return;
      }
      if (jwtDecode(res.access)) {
        setAuthTokens(res);
        setAuthUser(jwtDecode(res.access));
        localStorage.setItem("authTokens", JSON.stringify(res));
        if (jwtDecode(res.access).account_type === "landlord") {
          window.location.href = "/dashboard/landlord";
        } else {
          window.location.href = "/dashboard/tenant";
        }
      } else {
        console.error("Invalid Token");
      }
    });
  };

  let logoutUser = () => {
    let redirectUrl = "";
    if (authUser.account_type === "landlord") {
      redirectUrl = "/dashboard/landlord/login";
    } else if (authUser.account_type === "tenant") {
      redirectUrl = "/dashboard/tenant/login";
    } else {
      redirectUrl = "/";
    }
    setAuthTokens(null);
    setAuthUser(null);
    localStorage.removeItem("authTokens");
    //navigate to /login route
    window.location.href = redirectUrl;
  };

  let updateToken = async () => {
    try {
      const res = await refreshTokens({ refresh: authTokens.refresh });

      if (typeof res.access === "undefined" || typeof res.access !== "string") {
        return;
      }

      setAuthTokens(res);
      setAuthUser(jwtDecode(res.access));
      localStorage.setItem("authTokens", JSON.stringify(res));

      // Check if the new token is still expired
      if (isTokenExpired(res.access)) {
        // Handle this case, e.g., log the user out
        // logoutUser();
        updateToken();
        return;
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.log("Update Token Error: ", error);
    }
  };

  let contextData = {
    updateToken,
    loginUser,
    logoutUser,
    authUser,
  };

  useEffect(() => {
    if (authTokens && isTokenExpired(authTokens.access)) {
      updateToken(); //TODO: Decide on weather to refresh the token or log user out
    }
    let minutes = 0.25;
    let refreshTime = 1000 * 60 * minutes;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, refreshTime);
    return () => {
      clearInterval(interval);
    };
  }, [authTokens, loading, updateToken]);

  return (
    <AuthContext.Provider value={contextData} {...props}>
      <AlertModal
        open={openError && errMsg}
        onClose={() => setErrMsg(null)}
        title={"Login Failed"}
        message={errMsg}
        onClick={() => setErrMsg(null)}
        btnText="Close"
      />
      {children}
    </AuthContext.Provider>
  );
}
