import { useState } from 'react';
import { ArrowLeft, Edit, Archive, User, Calendar, CheckCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChecklists } from '../hooks/useChecklists';
import { ChecklistItem } from '../components/ChecklistItem';
import { ChecklistEditor } from '../components/ChecklistEditor';
import { useParams, useNavigate } from 'react-router-dom';
import { Checklist } from '../types/checklist';

export default function ChecklistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { checklists, toggleItemComplete, archiveChecklist, updateChecklist } = useChecklists();
  const [isEditing, setIsEditing] = useState(false);
  
  const checklist = checklists.find(c => c.id === id);

  if (!checklist) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Checkliste nicht gefunden</h2>
          <p className="text-muted-foreground mb-4">Die angeforderte Checkliste existiert nicht.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = (updates: Partial<Checklist>) => {
    updateChecklist(checklist.id, updates);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ChecklistEditor
        checklist={checklist}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const completedItems = checklist.items.filter(item => item.completed).length;
  const totalItems = checklist.items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getStatusColor = (status: typeof checklist.status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'archived':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusText = (status: typeof checklist.status) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{checklist.title}</h1>
            {checklist.description && (
              <p className="text-muted-foreground text-lg">{checklist.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
            {checklist.status !== 'archived' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => archiveChecklist(checklist.id)}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archivieren
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>Status</span>
            </div>
            <Badge className={`${getStatusColor(checklist.status)} border`}>
              {getStatusText(checklist.status)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Verantwortlich</span>
            </div>
            <p className="font-medium">{checklist.responsible}</p>
            {checklist.deputy && (
              <p className="text-sm text-muted-foreground">Stellvertreter: {checklist.deputy}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Aktualisiert</span>
            </div>
            <p className="font-medium">
              {new Date(checklist.updatedAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Fortschritt</span>
            <span>{completedItems}/{totalItems} Punkte</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {checklist.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {checklist.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Checklisten-Punkte</h2>
        {checklist.items.length > 0 ? (
          <div className="space-y-3">
            {checklist.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onToggle={(itemId) => toggleItemComplete(checklist.id, itemId)}
                />
              ))
            }
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Keine Punkte in dieser Checkliste.</p>
          </div>
        )}
      </div>
    </div>
  );
}
