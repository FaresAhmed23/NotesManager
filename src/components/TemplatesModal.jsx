// components/TemplatesModal.jsx
import React from 'react';
import { X, FileText, Calendar, ListChecks, Target, BookOpen, Lightbulb } from 'lucide-react';

const TemplatesModal = ({ onClose, onSelectTemplate }) => {
  const templates = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Meeting Notes",
      description: "Capture key points, action items, and decisions from meetings",
      content: "# Meeting Notes\n\n**Date:** \n**Attendees:** \n\n## Agenda\n- \n\n## Discussion Points\n- \n\n## Action Items\n- [ ] \n\n## Next Steps\n"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Journal",
      description: "Reflect on your day and track your thoughts",
      content: "# Daily Journal\n\n**Date:** \n**Mood:** \n\n## Today's Highlights\n- \n\n## Gratitude\n- \n\n## Tomorrow's Goals\n- \n"
    },
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "To-Do List",
      description: "Organize tasks and track your progress",
      content: "# To-Do List\n\n## High Priority\n- [ ] \n\n## Medium Priority\n- [ ] \n\n## Low Priority\n- [ ] \n\n## Completed\n- [x] \n"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Project Plan",
      description: "Plan and track project milestones",
      content: "# Project Plan\n\n**Project Name:** \n**Timeline:** \n\n## Objectives\n- \n\n## Milestones\n- [ ] \n\n## Resources\n- \n\n## Risks\n- \n"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Study Notes",
      description: "Organize your learning materials effectively",
      content: "# Study Notes\n\n**Subject:** \n**Topic:** \n\n## Key Concepts\n- \n\n## Important Points\n- \n\n## Questions\n- \n\n## Summary\n"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Idea Brainstorm",
      description: "Capture and develop your creative ideas",
      content: "# Idea Brainstorm\n\n**Main Idea:** \n\n## Related Thoughts\n- \n\n## Pros\n- \n\n## Cons\n- \n\n## Next Actions\n- \n"
    }
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in-up"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden animate-scale-in-smooth">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Note Templates</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <p className="text-muted-foreground mb-8">
              Start with a template to quickly create structured notes for different purposes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <button
    key={index}
    className="p-6 bg-muted/30 rounded-xl hover:bg-muted/50 hover:border-primary border-2 border-transparent transition-all text-left group animate-fade-in-up"
    style={{ animationDelay: `${index * 100}ms` }}
    onClick={() => {
      if (onSelectTemplate) {
        onSelectTemplate(template);
      }
      onClose();
    }}
  >
                  <div className="text-primary mb-3 group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplatesModal;