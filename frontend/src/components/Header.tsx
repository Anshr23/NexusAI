import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavLink from "./shared/NavLink";
import { useLocation } from "react-router-dom";

const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

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