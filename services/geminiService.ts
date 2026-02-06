
import { GoogleGenAI, Type } from "@google/genai";
import { HomeworkTask, Subject } from "../types";

// Always use the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async breakDownTask(task: HomeworkTask, subject: Subject | undefined): Promise<string[]> {
    const prompt = `
      As an academic assistant, break down the following homework task into a list of 4-6 actionable, sequential sub-tasks.
      
      Subject: ${subject?.name || 'General'}
      Task Title: ${task.title}
      Description: ${task.description}
      Due Date: ${task.dueDate}
      
      Return the response as a JSON array of strings.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      // Access text as a property, not a method.
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("AI Breakdown Error:", error);
      return ["Review requirements", "Start research", "Draft content", "Proofread and submit"];
    }
  },

  async suggestStudySchedule(tasks: HomeworkTask[], subjects: Subject[]): Promise<string> {
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const taskData = activeTasks.map(t => ({
      title: t.title,
      subject: subjects.find(s => s.id === t.subjectId)?.name,
      priority: t.priority,
      dueDate: t.dueDate
    }));

    const prompt = `
      I have the following homework tasks:
      ${JSON.stringify(taskData, null, 2)}
      
      Create a focused study schedule for today to help me be most productive. 
      Prioritize based on deadlines and task priority. Use Markdown formatting.
      Keep it encouraging and include short breaks.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      // Access text as a property, not a method.
      return response.text || "Could not generate schedule at this time.";
    } catch (error) {
      console.error("AI Schedule Error:", error);
      return "Oops! My AI brain is taking a quick break. Try again in a moment!";
    }
  }
};
