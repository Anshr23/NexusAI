import { Link } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";

const Footer = () => {
  return (
    <footer style={{ marginTop: "80px", width: "100%" }}>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: 3,
          py: 5,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img src="/logormbg.png" alt="NexusAI" width="26px" height="26px" />
          <Typography sx={{ fontWeight: "700", fontSize: "18px", color: "white" }}>
            Nexus<span style={{ color: "#00fffc" }}>AI</span>
          </Typography>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", ml: 1 }}>
            — Conversational Intelligence Platform
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Link
            to="/"
            style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", fontSize: "14px" }}
          >
            Home
          </Link>
          <Link
            to="/chat"
            style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", fontSize: "14px" }}
          >
            Chat
          </Link>
          <a
            href="https://github.com/Anshr23/NexusAI"
            target="_blank"
            rel="noreferrer"
            style={{ color: "rgba(255, 255, 255, 0.7)", textDecoration: "none", fontSize: "14px" }}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anshr23/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#00fffc", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}
          >
            Developer
          </a>
        </Box>
      </Box>
      <Box sx={{ bgcolor: "rgba(0, 0, 0, 0.3)", py: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.45)" }}>
          © {new Date().getFullYear()} NexusAI Platform. Multi-LLM Orchestration by{" "}
          <a
            href="https://www.linkedin.com/in/anshr23/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#00fffc", textDecoration: "none" }}
          >
            Ansh Rai
          </a>
          . All rights reserved.
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;