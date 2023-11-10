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
        console.log("Decoded ", jwtDecode(res.access));
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
    }else{
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
      refreshTokens({ refresh: authTokens.refresh }).then((res) => {
        if (
          typeof res.access === "undefined" ||
          typeof res.access !== "string"
        ) {
          console.log("Update Token Error: ", res);
          return;
        }
        setAuthTokens(res);
        setAuthUser(jwtDecode(res.access));
        localStorage.setItem("authTokens", JSON.stringify(res));
        console.log("Updated Token Decoded ", jwtDecode(res.access));
        console.log("Update Token Res ", res);
      });
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.log("Update Token Error: ", error);
    }
  };

  let contextData = {
    loginUser,
    logoutUser,
    authUser,
  };

  useEffect(() => {
    let minutes = 0.15;
    let refreshTime = 1000 * 60 * minutes;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, refreshTime);
    return () => {
      clearInterval(interval);
    };
  }, [authTokens, loading]);

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
