import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

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

    for (const msg of history) {
      if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.text });
      }
    }

    const result = await chat.sendMessage({ message: newMessage });
    
    const functionCalls = result.functionCalls;
    if (functionCalls && functionCalls.length > 0 && onHighlight) {
      for (const call of functionCalls) {
        if (call.name === 'highlightNode') {
          // Type guard for unknown
          const args = call.args as Record<string, unknown>;
          if (typeof args.value === 'number') {
             onHighlight(args.value);
          }
        }
      }
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
