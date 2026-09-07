import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import TypingAnim from "../components/shared/TypingAnim";
import Footer from "../components/shared/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoSparkles, IoFlash, IoShieldCheckmark, IoCodeSlash } from "react-icons/io5";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const auth = useAuth();

  const handleCta = () => {
    if (auth?.isLoggedIn) {
      navigate("/chat");
    } else {
      navigate("/signup");
    }
  };

  return (
    <Box width={"100%"} minHeight={"100vh"} display="flex" flexDirection="column">
      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1200px",
          mx: "auto",
          mt: 4,
          px: 3,
        }}
      >
        {/* Status Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(0, 255, 252, 0.08)",
            border: "1px solid rgba(0, 255, 252, 0.25)",
            borderRadius: "50px",
            px: 2.5,
            py: 0.8,
            mb: 3,
            boxShadow: "0 0 15px rgba(0, 255, 252, 0.1)",
          }}
        >
          <IoSparkles color="#00fffc" size={16} />
          <Typography sx={{ color: "#00fffc", fontSize: "14px", fontWeight: 600 }}>
            Multi-LLM Fallback: Groq • Gemini • OpenAI
          </Typography>
        </Box>

        {/* Animated Headline */}
        <Box sx={{ minHeight: "90px", textAlign: "center", my: 1 }}>
          <TypingAnim />
        </Box>

        {/* Subtitle */}
        <Typography
          sx={{
            maxWidth: "750px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: { xs: "16px", md: "19px" },
            lineHeight: 1.6,
            mt: 2,
            mb: 4,
          }}
        >
          Experience intelligent conversational AI with zero-downtime failover,
          persistent conversation memory, and developer-grade syntax highlighting.
        </Typography>

        {/* CTA Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            onClick={handleCta}
            sx={{
              bgcolor: "#00fffc",
              color: "#05101c",
              fontWeight: 700,
              fontSize: "16px",
              px: 4,
              py: 1.5,
              borderRadius: "10px",
              textTransform: "none",
              boxShadow: "0 4px 20px rgba(0, 255, 252, 0.4)",
              transition: "all 0.2s ease-in-out",
              ":hover": {
                bgcolor: "#ffffff",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 25px rgba(0, 255, 252, 0.6)",
              },
            }}
          >
            {auth?.isLoggedIn ? "Go To Chat Studio →" : "Get Started Free →"}
          </Button>
          {!auth?.isLoggedIn && (
            <Button
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "16px",
                px: 3.5,
                py: 1.5,
                borderRadius: "10px",
                textTransform: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                ":hover": {
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  borderColor: "#00fffc",
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>

        {/* Hero Visual Preview */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            my: 2,
          }}
        >
          <img
            src="/jack2.png"
            alt="NexusAI Mascot"
            style={{
              width: isBelowMd ? "200px" : "260px",
              filter: "drop-shadow(0 0 35px rgba(0, 255, 252, 0.35))",
            }}
          />
          <img
            src="/chat.png"
            alt="NexusAI Interface Preview"
            style={{
              width: isBelowMd ? "95%" : "62%",
              borderRadius: "16px",
              boxShadow: "0 0 45px rgba(0, 255, 252, 0.2)",
              border: "1px solid rgba(0, 255, 252, 0.25)",
            }}
          />
        </Box>

        {/* Feature Cards Grid */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            mt: 8,
            mb: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(17, 29, 45, 0.7)",
              border: "1px solid rgba(0, 255, 252, 0.2)",
              borderRadius: "14px",
              p: 3.5,
              backdropFilter: "blur(10px)",
              transition: "transform 0.2s, border-color 0.2s",
              ":hover": {
                transform: "translateY(-4px)",
                borderColor: "#00fffc",
              },
            }}
          >
            <Box
              sx={{
                width: "44px",
                height: "44px",
                bgcolor: "rgba(0, 255, 252, 0.1)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <IoFlash color="#00fffc" size={24} />
            </Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
              Multi-LLM Fallback
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "14px", lineHeight: 1.6 }}>
              Seamlessly cascades from Groq (Llama/OSS) to Gemini 3.6 Flash and OpenAI GPT-4, guaranteeing uninterrupted uptime.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(17, 29, 45, 0.7)",
              border: "1px solid rgba(0, 255, 252, 0.2)",
              borderRadius: "14px",
              p: 3.5,
              backdropFilter: "blur(10px)",
              transition: "transform 0.2s, border-color 0.2s",
              ":hover": {
                transform: "translateY(-4px)",
                borderColor: "#00fffc",
              },
            }}
          >
            <Box
              sx={{
                width: "44px",
                height: "44px",
                bgcolor: "rgba(0, 255, 252, 0.1)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <IoShieldCheckmark color="#00fffc" size={24} />
            </Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
              Persistent Context
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "14px", lineHeight: 1.6 }}>
              Store, retrieve, and manage full conversation history securely with MongoDB and signed HttpOnly cookies.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(17, 29, 45, 0.7)",
              border: "1px solid rgba(0, 255, 252, 0.2)",
              borderRadius: "14px",
              p: 3.5,
              backdropFilter: "blur(10px)",
              transition: "transform 0.2s, border-color 0.2s",
              ":hover": {
                transform: "translateY(-4px)",
                borderColor: "#00fffc",
              },
            }}
          >
            <Box
              sx={{
                width: "44px",
                height: "44px",
                bgcolor: "rgba(0, 255, 252, 0.1)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <IoCodeSlash color="#00fffc" size={24} />
            </Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
              Code Highlighting
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "14px", lineHeight: 1.6 }}>
              Developer-optimized response rendering with syntax highlighting across dozens of programming languages.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;