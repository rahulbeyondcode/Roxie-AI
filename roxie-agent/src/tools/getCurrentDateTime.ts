import { tool } from "@langchain/core/tools";

const getCurrentDateTime = tool(
  async () => {
    const now = new Date();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12 || 12; // convert to 12-hour format

    const finalPayload = {
      dayName,
      day,
      monthName,
      year,
      hours,
      minutes,
      seconds,
      amOrpm: ampm
    }

    return JSON.stringify(finalPayload);
  },
  {
    name: "getCurrentDateTime",
    description: "Use this tool to fetch the current system date and time in real-time. This is useful when you need to timestamp an event (e.g., when someone was last contacted or met), schedule a task based on 'now', or simply respond to queries like 'what is the time' or 'what day is it today' The response will always include both the current date (in DD/MM/YYYY format) and time (in hh:mm:ss A format). This tool should be invoked whenever you require accurate, up-to-the-second time data for logging, decision-making, or interacting with time-base d records.",
  }
);;

export default getCurrentDateTime;