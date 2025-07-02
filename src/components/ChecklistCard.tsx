
import { Calendar, User, CheckCircle, Clock, Archive, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checklist } from '../types/checklist';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface ChecklistCardProps {
  checklist: Checklist;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function ChecklistCard({ checklist, onArchive, onRestore, onClick }: ChecklistCardProps) {
  const completedItems = checklist.items.filter(item => item.completed).length;
  const totalItems = checklist.items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getStatusColor = (status: Checklist['status']) => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'archived':
        return 'status-archived';
      default:
        return 'status-open';
    }
  };

  const getStatusText = (status: Checklist['status']) => {
    switch (status) {
      case 'open':
        return 'Offen';
      case 'in-progress':
        return 'In Bearbeitung';
      case 'completed':
        return 'Abgeschlossen';
      case 'archived':
        return 'Archiviert';
      default:
        return 'Offen';
    }
  };

  const getStatusIcon = (status: Checklist['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'archived':
        return <Archive className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onClick?.(checklist.id)}>
            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {checklist.title}
            </CardTitle>
            {checklist.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {checklist.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              {checklist.status === 'archived' ? (
                <DropdownMenuItem onClick={() => onRestore?.(checklist.id)}>
                  Wiederherstellen
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onArchive?.(checklist.id)}>
                  Archivieren
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4" onClick={() => onClick?.(checklist.id)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`status-badge ${getStatusColor(checklist.status)} flex items-center gap-1`}>
              {getStatusIcon(checklist.status)}
              {getStatusText(checklist.status)}
            </span>
            {checklist.isTemplate && (
              <Badge variant="outline" className="text-xs">
                Template
              </Badge>
            )}
          </div>

          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Fortschritt</span>
              <span>{completedItems}/{totalItems}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-1">
            {checklist.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {checklist.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{checklist.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{checklist.responsible}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(checklist.updatedAt, { 
                addSuffix: true, 
                locale: de 
              })}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
