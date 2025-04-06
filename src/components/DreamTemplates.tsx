
import { useState } from "react";
import { DreamTemplate, DreamMood, DreamType, DreamCategory } from "@/types/dream";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getTemplates, deleteTemplate } from "@/utils/templateStorage";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { saveDream } from "@/utils/dreamStorage";
import { useToast } from "@/hooks/use-toast";

interface DreamTemplatesProps {
  onSelectTemplate: (template: DreamTemplate) => void;
  onCreateNewDream: () => void;
}

const DreamTemplates = ({ onSelectTemplate, onCreateNewDream }: DreamTemplatesProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<DreamTemplate[]>(getTemplates());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const refreshTemplates = () => {
    setTemplates(getTemplates());
  };

  const handleSelectTemplate = (template: DreamTemplate) => {
    onSelectTemplate(template);
  };

  const handleDeleteTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedTemplateId) {
      deleteTemplate(selectedTemplateId);
      refreshTemplates();
      setShowDeleteDialog(false);
      
      toast({
        title: "Template deleted",
        description: "The dream template has been removed",
      });
    }
  };

  const handleQuickCreate = (template: DreamTemplate) => {
    // Create a new dream from template
    const newDream = {
      id: crypto.randomUUID(),
      title: `${template.name} - ${new Date().toLocaleDateString()}`,
      description: template.description,
      date: new Date().toISOString(),
      mood: template.mood,
      type: template.type,
      category: template.category,
      tags: template.tags,
      isStarred: false,
      isPublic: false
    };
    
    saveDream(newDream);
    
    toast({
      title: "Dream created",
      description: "A new dream has been created from the template",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white dream-text">Dream Templates</h3>
        <Button 
          onClick={onCreateNewDream}
          className="bg-dream-gradient hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Dream
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-white/50 backdrop-blur-sm border border-dream-light-purple/30 overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-dream-light-purple/20 text-dream-purple text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-dream-light-purple/30"
                onClick={() => handleSelectTemplate(template)}
              >
                Use Template
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-dream-purple h-8 w-8"
                  onClick={() => handleQuickCreate(template)}
                  title="Quick create dream from template"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive h-8 w-8"
                  onClick={() => handleDeleteTemplate(template.id)}
                  title="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DreamTemplates;
