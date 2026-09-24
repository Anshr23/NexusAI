import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavLink from "./shared/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === "/chat";

  const handleDemoLogin = async () => {
    try {
      toast.loading("Logging in as Demo User...", { id: "demo" });
      try {
        await auth?.login("demo@gmail.com", "demo123");
      } catch (err: any) {
        const serverMsg =
          err?.response?.data?.cause ||
          err?.response?.data?.message ||
          err?.response?.data ||
          "";
        if (
          typeof serverMsg === "string" &&
          (serverMsg.toLowerCase().includes("not registered") ||
            serverMsg.toLowerCase().includes("not found"))
        ) {
          // If demo user does not exist in DB yet, auto-create it
          await auth?.signup("Demo", "demo@gmail.com", "demo123");
        } else {
          throw err;
        }
      }
      toast.success("Welcome, Demo User!", { id: "demo" });
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error("Demo login failed. Please try again.", { id: "demo" });
    }
  };

  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {auth?.isLoggedIn ? (
            <>
              {isChatPage ? (
                <NavLink
                  bg="#00fffc"
                  to="/"
                  text="Home"
                  textColor="black"
                />
              ) : (
                <NavLink
                  bg="#00fffc"
                  to="/chat"
                  text="Go To Chat"
                  textColor="black"
                />
              )}
              <NavLink
                bg="#51538f"
                textColor="white"
                to="/"
                text="Logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              {location.pathname !== "/" && (
                <NavLink
                  bg="transparent"
                  to="/"
                  text="Home"
                  textColor="white"
                />
              )}
              <NavLink
                bg="linear-gradient(135deg, rgba(0, 255, 252, 0.2), rgba(81, 83, 143, 0.4))"
                to="#"
                text="Demo Account"
                textColor="#00fffc"
                onClick={handleDemoLogin}
              />
              <NavLink
                bg="#00fffc"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;