import { useState } from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";

interface CodeSegment {
  isCode: boolean;
  content: string;
  language?: string;
}

function parseMessage(content: string): CodeSegment[] {
  if (!content) return [];
  if (!content.includes("```")) {
    return [{ isCode: false, content }];
  }

  const parts = content.split("```");
  return parts.map((part, index) => {
    // Odd index is a code block enclosed in ```
    if (index % 2 === 1) {
      const firstNewline = part.indexOf("\n");
      if (firstNewline !== -1) {
        const potentialLang = part.slice(0, firstNewline).trim().toLowerCase();
        if (potentialLang && !potentialLang.includes(" ") && potentialLang.length < 25) {
          return {
            isCode: true,
            language: potentialLang,
            content: part.slice(firstNewline + 1),
          };
        }
      }
      return {
        isCode: true,
        language: "javascript",
        content: part,
      };
    }
    return {
      isCode: false,
      content: part,
    };
  });
}

const CodeBlock = ({ language, code }: { language?: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!", { id: "clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy code");
    }
  };

  return (
    <Box
      sx={{
        my: 1.5,
        maxWidth: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid rgba(0, 255, 252, 0.2)",
        bgcolor: "#0d1b2a",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      }}
    >
      {/* Code Header Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 0.8,
          bgcolor: "rgba(0, 0, 0, 0.45)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            color: "#00fffc",
            fontFamily: "monospace",
            textTransform: "lowercase",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          {language || "code"}
        </Typography>
        <Button
          onClick={handleCopy}
          size="small"
          startIcon={copied ? <IoCheckmark color="#00fffc" size={15} /> : <IoCopyOutline size={15} />}
          sx={{
            color: copied ? "#00fffc" : "rgba(255, 255, 255, 0.8)",
            textTransform: "none",
            fontSize: "12px",
            py: 0.3,
            px: 1.2,
            borderRadius: "6px",
            bgcolor: "rgba(255, 255, 255, 0.05)",
            ":hover": {
              bgcolor: "rgba(0, 255, 252, 0.15)",
              color: "#ffffff",
            },
          }}
        >
          {copied ? "Copied!" : "Copy code"}
        </Button>
      </Box>

      <SyntaxHighlighter
        style={coldarkDark}
        language={language || "javascript"}
        wrapLongLines={true}
        customStyle={{
          margin: 0,
          padding: "16px",
          fontSize: "14px",
          maxWidth: "100%",
          overflowX: "auto",
          boxSizing: "border-box",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const segments = parseMessage(content);
  const auth = useAuth();
  const isAssistant = role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        p: { xs: 1.5, md: 2 },
        bgcolor: isAssistant ? "rgba(0, 77, 86, 0.2)" : "#004d56",
        border: isAssistant ? "1px solid rgba(0, 255, 252, 0.15)" : "none",
        gap: 2,
        borderRadius: "12px",
        my: 1,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        minWidth: 0,
      }}
    >
      <Avatar
        sx={{
          ml: 0,
          bgcolor: isAssistant ? "#004d56" : "#05101c",
          border: isAssistant ? "1px solid rgba(0, 255, 252, 0.4)" : "none",
          p: isAssistant ? 0.5 : 0,
          flexShrink: 0,
        }}
      >
        {isAssistant ? (
          <img src="/logormbg.png" alt="NexusAI" width="22px" height="22px" />
        ) : (
          auth?.user?.name?.[0] || "U"
        )}
      </Avatar>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {segments.map((seg, idx) =>
          seg.isCode ? (
            <CodeBlock key={idx} language={seg.language} code={seg.content.trim()} />
          ) : (
            <Typography
              key={idx}
              sx={{
                fontSize: { xs: "15px", md: "17px" },
                color: "#ffffff",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: 1.6,
              }}
            >
              {seg.content}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;