import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        "Chat With NexusAI",
        1500,
        "Multi-LLM Powered Intelligence 🤖",
        2000,
        "Powered by Groq, Gemini & OpenAI ⚡",
        2000,
        "Your Personalized Conversational Hub 💻",
        1500,
      ]}
      speed={50}
      style={{
        fontSize: "60px",
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
      }}
      repeat={Infinity}
    />
  );
};

export default TypingAnim;