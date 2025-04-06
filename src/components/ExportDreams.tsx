
import React, { useState } from "react";
import { exportDreamsAsJSON, exportDreamsAsCSV } from "@/utils/exportDreams";
import { Dream } from "@/types/dream";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportDreamsProps {
  dreams: Dream[];
}

const ExportDreams = ({ dreams }: ExportDreamsProps) => {
  const { toast } = useToast();
  
  const handleExport = (format: "json" | "csv") => {
    try {
      if (dreams.length === 0) {
        toast({
          title: "No dreams to export",
          description: "Add some dreams to your journal first.",
          variant: "destructive",
        });
        return;
      }
      
      if (format === "json") {
        exportDreamsAsJSON(dreams);
      } else {
        exportDreamsAsCSV(dreams);
      }
      
      toast({
        title: "Export successful",
        description: `Your dreams have been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your dreams.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-dream-light-purple/30">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("json")}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDreams;
