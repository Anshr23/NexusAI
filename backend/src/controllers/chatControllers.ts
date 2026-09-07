import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { getAIProviders } from "../config/aiConfig.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
      return;
    }
    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role: role as "user" | "assistant" | "system",
      content,
    }));
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    const providers = getAIProviders();
    if (providers.length === 0) {
      res.status(500).json({
        message:
          "No AI API keys configured. Please add GROQ_API_KEY, GEMINI_API_KEY, or OPEN_AI_SECRET in .env",
      });
      return;
    }

    let completionResponse: string | null = null;
    let successfulProvider = "";

    // Fallback across configured providers
    for (const provider of providers) {
      try {
        console.log(`Attempting completion with ${provider.name}...`);
        const chatResponse = await provider.client.chat.completions.create({
          model: provider.model,
          messages: chats,
        });

        let reply = chatResponse.choices[0]?.message?.content;
        if (reply) {
          // Strip thinking tags if returned by reasoning models
          reply = reply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
          completionResponse = reply;
          successfulProvider = provider.name;
          console.log(`Success with ${provider.name}`);
          break;
        }
      } catch (providerError: any) {
        console.warn(
          `Provider ${provider.name} failed:`,
          providerError?.message || providerError
        );
      }
    }

    if (!completionResponse) {
      res.status(500).json({
        message:
          "All configured AI providers failed. Please verify your API keys or rate limits.",
      });
      return;
    }

    user.chats.push({
      role: "assistant",
      content: completionResponse,
    });
    await user.save();
    res.status(200).json({ chats: user.chats, provider: successfulProvider });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", cause: error?.message });
    return;
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }
    res.status(200).json({ message: "OK", chats: user.chats });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    res.status(200).json({ message: "OK" });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};