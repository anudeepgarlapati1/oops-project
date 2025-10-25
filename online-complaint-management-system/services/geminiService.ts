
import { GoogleGenAI, Type } from "@google/genai";
import { Complaint, ComplaintCategory } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const suggestCategory = async (details: string): Promise<ComplaintCategory> => {
    if (!details || details.trim().length < 10) {
        return ComplaintCategory.Other;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following complaint and classify it into one of these categories: Technical, Billing, Service, Other. Provide only the category name as the response. Complaint: "${details}"`,
            config: {
                temperature: 0,
            }
        });
        const categoryText = response.text.trim();
        if (Object.values(ComplaintCategory).includes(categoryText as ComplaintCategory)) {
            return categoryText as ComplaintCategory;
        }
        return ComplaintCategory.Other;
    } catch (error) {
        console.error("Error suggesting category:", error);
        return ComplaintCategory.Other;
    }
};


export const summarizeComplaint = async (details: string): Promise<string> => {
    if (!details) return "";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Summarize the following customer complaint in one or two sentences for an internal support agent. Complaint: "${details}"`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error summarizing complaint:", error);
        return "Could not generate summary.";
    }
};

export const suggestResponse = async (complaint: Complaint): Promise<string> => {
    try {
        const prompt = `
            You are a helpful and empathetic customer support agent.
            Generate a professional and helpful response to the following customer complaint.
            - Address the customer by name.
            - Acknowledge their issue clearly.
            - If it's a technical or service issue, assure them you are looking into it and provide a ticket number (${complaint.id}).
            - If it's a billing issue, state that you will review their account and get back to them.
            - Keep the tone positive and reassuring.

            Customer Name: ${complaint.name}
            Complaint Subject: ${complaint.subject}
            Complaint Details: "${complaint.details}"
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error suggesting response:", error);
        return "Could not generate a suggested response.";
    }
};
