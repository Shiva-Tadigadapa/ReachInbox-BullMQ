import {
  GenerativeModel,
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKEY = "AIzaSyAu0swEohq4GbIx4LpArOXL0W4FTsqrdsg";

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(apiKEY);

// Specify the model you want to use for email analysis
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Replace with the appropriate model name from Google Generative AI
});

// Configuration for generating responses (not directly related to email analysis)
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to analyze email using the Generative AI model with a custom prompt

const customPrompt = `okay now you are an email labeler and you are only to to give me three responses to this email. which will be "Interested", "Not Interested", "More Information" based on the email content you have to give me the label.
  you are strictly prohibited to give any other response or summary of the email. you only have to give me lables.
  And only three labels are allowed. And only give lable as interested if you are sure we have to give reply to this email. if you are not sure then give lable as "More Information" and if you are sure we should not reply to this email then give lable as "Not Interested".
  and if there are any jobs or blogs from medium you  can give intrested label to those emails. and if there are any emails from noreply or no-reply then you can give the label as "Not Interested" and if you are not able to understand the email content then you can ignore the email and give the label as "More Information"

  `;
const analyzeEmailUsingGenerativeAI = async (emailText: string, from: any) => {
  try {
    // Constructing the prompt with email text and custom instructions
    const prompt = `${customPrompt}\nEmail Content:\n${emailText} and here is the sender of the email ${from} if you are not able to understand the email content then you can ignore the email and give the label as "More Information and if the sender email is has any thing like "noreply" or "no-reply" then you can give the label as "Not Interested" and if you are sure we have to reply to this email then give the label as "Interested"`;
    console.log("prompt:", prompt);

    // // Generate response from Generative AI model
    const response = await model.generateContent(prompt);

    console.log("response:", response.response);
    // // Example: Extract analysis result from response
    // // const analysisResult = response.data.choices[0].text.trim(); // Example: get the first choice as text

    return response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Error analyzing email with Generative AI:", error);
    return "Unable to analyze email"; // Fallback or error handling
  }
};

export default analyzeEmailUsingGenerativeAI;
