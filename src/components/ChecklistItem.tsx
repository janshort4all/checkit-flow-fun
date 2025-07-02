
import { useState } from 'react';
import { Check, ExternalLink, Image, MessageCircle, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChecklistItem as ChecklistItemType } from '../types/checklist';
import { cn } from '@/lib/utils';
import { OrgChart } from './OrgChart';

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

  const hasExtendedContent = (item.images && item.images.length > 0) || 
                            (item as any).orgChart?.length > 0;

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
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  'font-medium text-sm transition-all duration-200',
                  item.completed 
                    ? 'line-through text-muted-foreground' 
                    : 'text-foreground hover:text-primary'
                )}>
                  {item.title}
                </h3>
                {hasExtendedContent && showDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
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

          {showDetails && item.links && item.links.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {item.links.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      if (link.type === 'external') {
                        window.open(link.url, '_blank');
                      } else {
                        window.open(link.url, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {link.title}
                    {link.type === 'internal' && (
                      <span className="ml-1 text-xs opacity-60">(lokal)</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isExpanded && showDetails && hasExtendedContent && (
            <div className="mt-4 space-y-4 p-3 bg-muted/30 rounded-lg">
              {item.images && item.images.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="h-4 w-4" />
                    <span className="text-sm font-medium">Bilder</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {item.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <span className="text-white text-xs text-center p-1">
                            {image.alt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(item as any).orgChart && (item as any).orgChart.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Organigramm</span>
                  </div>
                  <OrgChart
                    data={(item as any).orgChart}
                    onUpdate={() => {}}
                    editable={false}
                  />
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
