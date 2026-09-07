import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chats/Chatitem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/apiCommunicator";
import toast from "react-hot-toast";
type Message = {
  role: "user" | "assistant";
  content: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (!content || content.trim() === "") return;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate response. Please try again.");
    }
  };
  const handleDeleteChats = async () => {
    setOpenConfirm(false);
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth]);
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        mt: 3,
        gap: { xs: 1, md: 3 },
        px: { xs: 1, md: 2 },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.22,
          minWidth: "260px",
          maxWidth: "320px",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "70vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 1,
            p: 2,
            boxSizing: "border-box",
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name?.[0]}
            {auth?.user?.name?.split(" ")?.[1]?.[0] || ""}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", fontWeight: 600 }}>
            NexusAI Studio
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 3, px: 2, textAlign: "center", color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
            Chat across Groq, Gemini, and OpenAI with persistent memory and code highlighting.
          </Typography>
          <Button
            onClick={() => setOpenConfirm(true)}
            sx={{
              width: "85%",
              mt: "auto",
              mb: 2,
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[400],
              ":hover": {
                bgcolor: red[600],
              },
            }}
          >
            Clear Conversation
          </Button>

          {/* Confirmation Dialog */}
          <Dialog
            open={openConfirm}
            onClose={() => setOpenConfirm(false)}
            PaperProps={{
              sx: {
                bgcolor: "#0d1b2a",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "14px",
                p: 1.5,
                color: "white",
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, color: "#ffffff" }}>
              Clear Chat History?
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: "rgba(255, 255, 255, 0.75)" }}>
                Are you sure you want to permanently delete all messages in this conversation? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setOpenConfirm(false)}
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textTransform: "none",
                  fontWeight: 600,
                  ":hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteChats}
                sx={{
                  bgcolor: "#ef4444",
                  color: "white",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2.5,
                  borderRadius: "8px",
                  ":hover": { bgcolor: "#dc2626" },
                }}
                autoFocus
              >
                Yes, Clear All
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minWidth: 0,
          maxWidth: "100%",
          flexDirection: "column",
          px: { xs: 1, md: 3 },
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontSize: "36px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Nexus<span style={{ color: "#00fffc" }}>AI</span> Assistant
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "65vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
            boxSizing: "border-box",
          }}
        >
          {chatMessages.map((chat, index) => (
            //@ts-ignore
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 14,
            backgroundColor: "#0e1a26",
            border: "1.5px solid rgba(0, 255, 252, 0.35)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 252, 0.12)",
            display: "flex",
            alignItems: "center",
            marginTop: "20px",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask NexusAI anything... (Press Enter to send)"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "20px 24px",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "18px",
              fontFamily: "inherit",
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{
              bgcolor: "#00fffc",
              color: "#05101c",
              mr: 2,
              p: 1.5,
              borderRadius: "10px",
              transition: "all 0.2s ease-in-out",
              ":hover": {
                bgcolor: "#ffffff",
                transform: "scale(1.08)",
                boxShadow: "0 0 12px #00fffc",
              },
            }}
          >
            <IoMdSend size={22} />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;