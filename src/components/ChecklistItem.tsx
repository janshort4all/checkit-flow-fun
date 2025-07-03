
import { useState } from 'react';
import { Check, ExternalLink, Image, MessageCircle, Users, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
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
        'checklist-item border rounded-lg transition-all duration-200',
        item.completed ? 'completed border-success-200 bg-success-50/50' : 'border-border bg-background',
        isDragging && 'opacity-50 transform rotate-2'
      )}>
        <div className="flex items-start gap-3 p-4">
          {showDetails && (
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mt-1">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
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

            {/* Bilder Vorschau */}
            {showDetails && item.images && item.images.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {item.images.length} Bild{item.images.length > 1 ? 'er' : ''}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {item.images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="relative group cursor-pointer flex-shrink-0"
                      onClick={() => openImageViewer(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-16 h-16 object-cover rounded border hover:shadow-md transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                            <Image className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {showDetails && item.links && item.links.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {item.links.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
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

            {/* Organigramm Button */}
            {showDetails && (item as any).orgChart && (item as any).orgChart.length > 0 && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 text-xs"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Organigramm anzeigen
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 ml-1" />
                  )}
                </Button>
              </div>
            )}

            {isExpanded && showDetails && hasExtendedContent && (
              <div className="mt-4 space-y-4 p-3 bg-muted/30 rounded-lg">
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
