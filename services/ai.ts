import { GoogleGenAI, FunctionDeclaration, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Tool definition for Gemini to interact with the visualizer
const highlightTool: FunctionDeclaration = {
  name: 'highlightNode',
  description: 'Highlight a specific node value in the visualization to explain a concept.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      value: {
        type: Type.NUMBER,
        description: 'The numeric value of the node to highlight.',
      },
    },
    required: ['value'],
  },
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const generateTutorResponse = async (
  history: ChatMessage[], 
  newMessage: string, 
  context: string,
  onHighlight?: (val: number) => void
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Convert simplified history to SDK format if needed, 
    // but for single turn with context, we can just construct the prompt.
    // For a real chat session, we would use ai.chats.create().
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are an expert Computer Science tutor specialized in Data Structures. 
        Current Context: ${context}.
        Keep answers concise, encouraging, and educational.
        Use the highlightNode tool to point out specific values when explaining.`,
        tools: [{ functionDeclarations: [highlightTool] }],
      }
    });

    // Replay history (simplified for this demo)
    for (const msg of history) {
      if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.text });
      }
      // We skip model turns in replay for simplicity in this stateless wrapper,
      // or we could maintain the chat object persistently in a hook.
    }

    const result = await chat.sendMessage({ message: newMessage });
    
    // Handle Function Calls
    const functionCalls = result.functionCalls;
    if (functionCalls && functionCalls.length > 0 && onHighlight) {
      for (const call of functionCalls) {
        if (call.name === 'highlightNode') {
          const args = call.args as any;
          onHighlight(args.value);
        }
      }
      // In a full implementation, we would send the function response back.
      // Here we just return the text response generated alongside or after.
    }

    return result.text || "I'm listening...";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the neural network. Please try again.";
  }
};

export const analyzeStructureImage = async (base64Image: string): Promise<number[] | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this image. If it contains a diagram of a tree or list with numbers, return ONLY a JSON array of the numbers found, in a logical insertion order (e.g., [10, 5, 15]). If not, return an empty array." }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Vision Error:", error);
    return null;
  }
};
