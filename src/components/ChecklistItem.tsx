
import { useState } from 'react';
import { Check, ExternalLink, Users, ChevronDown, ChevronRight, GripVertical, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChecklistItem as ChecklistItemType } from '../types/checklist';
import { cn } from '@/lib/utils';
import { OrgChart } from './OrgChart';
import { ImageViewer } from './ImageViewer';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (itemId: string) => void;
  showDetails?: boolean;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function ChecklistItem({ 
  item, 
  onToggle, 
  showDetails = true, 
  isDragging = false,
  dragHandleProps 
}: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleToggle = () => {
    onToggle(item.id);
  };

  const hasExtendedContent = (item as any).orgChart?.length > 0;

  const openImageViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className={cn(
        'checklist-item border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md',
        item.completed ? 'completed border-success-200 bg-success-50/30' : 'border-border bg-background hover:bg-muted/20',
        isDragging && 'opacity-50 transform rotate-1 shadow-lg'
      )}>
        <div className="flex items-start gap-4 p-5">
          {showDetails && (
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mt-1.5 opacity-40 hover:opacity-70 transition-opacity">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          <Checkbox
            checked={item.completed}
            onCheckedChange={handleToggle}
            className="mt-1.5 data-[state=checked]:bg-success-600 data-[state=checked]:border-success-600"
          />
          
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className={cn(
                  'font-semibold text-base leading-relaxed transition-all duration-200',
                  item.completed 
                    ? 'line-through text-muted-foreground/70' 
                    : 'text-foreground'
                )}>
                  {item.title}
                </h3>
                
                {item.description && showDetails && (
                  <p className={cn(
                    'text-sm mt-2 leading-relaxed transition-opacity duration-200',
                    item.completed ? 'text-muted-foreground/60' : 'text-muted-foreground'
                  )}>
                    {item.description}
                  </p>
                )}
              </div>
              
              {item.completed && item.completedBy && (
                <Badge variant="outline" className="bg-success-50 text-success-700 border-success-200 font-medium">
                  <Check className="h-3 w-3 mr-1.5" />
                  {item.completedBy}
                </Badge>
              )}
            </div>

            {/* Images Gallery */}
            {showDetails && item.images && item.images.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {item.images.map((image, index) => (
                  <div 
                    key={image.id} 
                    className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg border-2 border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    onClick={() => openImageViewer(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Elements Row */}
            {showDetails && ((item.links && item.links.length > 0) || hasExtendedContent) && (
              <div className="flex flex-wrap gap-3">
                {/* Links */}
                {item.links && item.links.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-sm"
                    onClick={() => {
                      if (link.type === 'external') {
                        window.open(link.url, '_blank');
                      } else {
                        window.open(link.url, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="font-medium">{link.title}</span>
                    {link.type === 'internal' && (
                      <span className="ml-2 text-xs opacity-60 bg-muted px-1.5 py-0.5 rounded">lokal</span>
                    )}
                  </Button>
                ))}

                {/* Process Flow Chart Button */}
                {hasExtendedContent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-9 px-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-sm"
                  >
                    <Workflow className="h-4 w-4 mr-2" />
                    <span className="font-medium">Prozessablauf</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Expanded Process Flow Content */}
            {isExpanded && showDetails && hasExtendedContent && (
              <div className="mt-4 p-5 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Workflow className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Prozessablauf</h4>
                    <p className="text-sm text-muted-foreground">Interaktives Flussdiagramm</p>
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                  <OrgChart
                    data={(item as any).orgChart}
                    onUpdate={() => {}}
                    editable={false}
                  />
                </div>
              </div>
            )}

            {/* Completion Timestamp */}
            {item.completedAt && (
              <div className="text-xs text-muted-foreground/70 mt-3 font-medium">
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

      {/* Image Viewer */}
      {viewerOpen && item.images && (
        <ImageViewer
          images={item.images}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
