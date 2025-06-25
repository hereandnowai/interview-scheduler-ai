
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SuggestedSlot } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set for Gemini. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface GetSuggestedSlotsParams {
  candidateName: string;
  candidateAvailability: string;
  candidateTimezone: string;
  managerName: string;
  managerAvailability: string;
  managerTimezone: string;
  interviewDurationMinutes: number;
  bufferMinutes: number; // For now, this is a general preference, AI might not explicitly use it for spacing single suggestions unless prompted.
  preferredBusinessHours: string; // Recruiter's working hours, e.g., "9 AM - 5 PM EST"
  currentDate: string; // YYYY-MM-DD
}

export const getSuggestedInterviewSlots = async (
  params: GetSuggestedSlotsParams
): Promise<SuggestedSlot[]> => {
  if (!API_KEY) {
    // Return a predefined error structure or throw, depending on how UI handles it
    console.error("Gemini API key not configured. Cannot fetch suggestions.");
    // alert("Gemini API key not configured. Cannot fetch suggestions.");
    return Promise.resolve([]); // Return empty array to prevent UI crash
  }
  const model = 'gemini-2.5-flash-preview-04-17';

  const scheduleFromInstruction = `Consider interviews can be scheduled starting from tomorrow of ${params.currentDate}.`;

  const prompt = `
You are an AI assistant specialized in scheduling interviews. Your goal is to find optimal interview slots.

Context:
- Candidate Name: ${params.candidateName}
- Candidate Availability: "${params.candidateAvailability}" (Timezone: ${params.candidateTimezone})
- Hiring Manager Name: ${params.managerName}
- Hiring Manager Availability: "${params.managerAvailability}" (Timezone: ${params.managerTimezone})
- Interview Duration: ${params.interviewDurationMinutes} minutes
- Recruiter's Preferred Business Hours for scheduling (e.g. for sending invites, not necessarily for interview times): ${params.preferredBusinessHours}
- Buffer time between interviews (if suggesting multiple consecutive slots, this is a preference): ${params.bufferMinutes} minutes. For single slot suggestions, this is less critical unless specified how.
- Current Date for context: ${params.currentDate}

Task:
${scheduleFromInstruction}
Find up to 5 suitable interview slots that work for BOTH the candidate and the hiring manager.
The slots MUST strictly fall within both parties' stated availabilities and respect the interview duration.
Consider time zone differences meticulously. All calculations must be accurate.

Output Format:
Respond ONLY with a JSON array of objects. Each object must represent a unique, viable interview slot and have the following structure:
{
  "utcStart": "YYYY-MM-DDTHH:mm:ssZ",  // Slot start time in UTC ISO 8601 format
  "utcEnd": "YYYY-MM-DDTHH:mm:ssZ",    // Slot end time in UTC ISO 8601 format
  "candidateReadable": "Day, Mon DD, HH:MM AM/PM TZ", // Slot time in candidate's local timezone (e.g., "Mon, Oct 28, 10:00 AM EDT")
  "managerReadable": "Day, Mon DD, HH:MM AM/PM TZ"    // Slot time in manager's local timezone (e.g., "Mon, Oct 28, 07:00 AM PDT")
}

If no suitable slots are found, return an empty JSON array ([]).
Do not include any explanatory text, greetings, or markdown formatting (like \`\`\`json) before or after the JSON array itself. The response must be pure JSON.
Double-check that utcStart and utcEnd are precisely ${params.interviewDurationMinutes} minutes apart.
Ensure readable times correctly reflect the UTC times in their respective timezones.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Lower temperature for more deterministic and factual scheduling
        topP: 0.9,
        topK: 32,
      },
    });

    let jsonStr = response.text.trim();
    // More robust fence removal
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    // Attempt to parse
    const parsedData = JSON.parse(jsonStr);

    // Validate structure (basic check)
    if (Array.isArray(parsedData) && (parsedData.length === 0 || 
        (parsedData[0] && typeof parsedData[0].utcStart === 'string'))) {
        return parsedData as SuggestedSlot[];
    } else {
        console.error("Gemini response is not in the expected array format:", parsedData);
        return [];
    }

  } catch (error) {
    console.error("Error fetching or parsing suggested slots from Gemini:", error);
    let errorMessage = "Failed to get suggestions from AI assistant.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
    }
    // Depending on your error handling strategy, you might throw or show a user-friendly message
    // For now, returning empty array to avoid breaking UI that expects SuggestedSlot[]
    // alert(errorMessage); // Or use a more sophisticated notification system
    return []; 
  }
};
    