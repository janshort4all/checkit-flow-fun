
import { useState } from 'react';
import { Check, ExternalLink, Image, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChecklistItem as ChecklistItemType } from '../types/checklist';
import { cn } from '@/lib/utils';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (itemId: string) => void;
  showDetails?: boolean;
}

export function ChecklistItem({ item, onToggle, showDetails = true }: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    onToggle(item.id);
  };

  return (
    <div className={cn(
      'checklist-item border rounded-lg transition-all duration-200',
      item.completed ? 'completed border-success-200 bg-success-50/50' : 'border-border bg-background'
    )}>
      <div className="flex items-start gap-3 p-4">
        <Checkbox
          checked={item.completed}
          onCheckedChange={handleToggle}
          className="mt-1 data-[state=checked]:bg-success-600 data-[state=checked]:border-success-600"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={cn(
                'font-medium text-sm transition-all duration-200',
                item.completed 
                  ? 'line-through text-muted-foreground' 
                  : 'text-foreground hover:text-primary'
              )}>
                {item.title}
              </h3>
              
              {item.description && showDetails && (
                <p className={cn(
                  'text-sm mt-1 transition-opacity duration-200',
                  item.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'
                )}>
                  {item.description}
                </p>
              )}
            </div>
            
            {item.completed && item.completedBy && (
              <Badge variant="outline" className="text-xs bg-success-50 text-success-700 border-success-200">
                <Check className="h-3 w-3 mr-1" />
                {item.completedBy}
              </Badge>
            )}
          </div>

          {showDetails && (item.links || item.images) && (
            <div className="mt-3 space-y-2">
              {item.links && item.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.links.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {link.title}
                    </Button>
                  ))}
                </div>
              )}

              {item.images && item.images.length > 0 && (
                <div className="flex gap-2">
                  {item.images.map((image) => (
                    <div key={image.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Image className="h-3 w-3" />
                      <span>{image.alt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {item.completedAt && (
            <div className="text-xs text-muted-foreground mt-2">
              Abgeschlossen: {new Date(item.completedAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
