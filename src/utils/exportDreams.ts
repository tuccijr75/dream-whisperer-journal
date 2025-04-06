
import { Dream } from "../types/dream";

export const exportDreamsAsJSON = (dreams: Dream[]): void => {
  try {
    const jsonData = JSON.stringify(dreams, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `dream-journal-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting dreams:", error);
    throw error;
  }
};

export const exportDreamsAsCSV = (dreams: Dream[]): void => {
  try {
    // Create CSV headers
    const headers = ["Title", "Date", "Description", "Mood", "Type", "Category", "Tags", "Interpretation"];
    
    // Convert dreams to CSV rows
    const rows = dreams.map(dream => [
      `"${dream.title.replace(/"/g, '""')}"`,
      dream.date,
      `"${dream.description.replace(/"/g, '""')}"`,
      dream.mood,
      dream.type,
      dream.category,
      dream.tags ? `"${dream.tags.join(", ")}"` : "",
      dream.interpretation ? `"${dream.interpretation.replace(/"/g, '""')}"` : ""
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `dream-journal-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting dreams as CSV:", error);
    throw error;
  }
};
