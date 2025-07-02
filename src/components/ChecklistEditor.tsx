
import { useState } from 'react';
import { Plus, Save, X, Link, Image, Users, Tag, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checklist, ChecklistItem } from '../types/checklist';

interface ChecklistEditorProps {
  checklist?: Checklist;
  onSave: (checklist: Partial<Checklist>) => void;
  onCancel: () => void;
}

export function ChecklistEditor({ checklist, onSave, onCancel }: ChecklistEditorProps) {
  const [title, setTitle] = useState(checklist?.title || '');
  const [description, setDescription] = useState(checklist?.description || '');
  const [responsible, setResponsible] = useState(checklist?.responsible || '');
  const [deputy, setDeputy] = useState(checklist?.deputy || '');
  const [tags, setTags] = useState<string[]>(checklist?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>(checklist?.items || []);
  const [isTemplate, setIsTemplate] = useState(checklist?.isTemplate || false);
  const [recurringPattern, setRecurringPattern] = useState(checklist?.recurringPattern);

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      title: '',
      description: '',
      completed: false,
      createdAt: new Date(),
      order: items.length,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const checklistData: Partial<Checklist> = {
      title,
      description,
      responsible,
      deputy,
      tags,
      items,
      isTemplate,
      recurringPattern,
      updatedAt: new Date(),
    };

    if (!checklist) {
      checklistData.id = `checklist-${Date.now()}`;
      checklistData.createdAt = new Date();
      checklistData.status = 'open';
      checklistData.version = 1;
    }

    onSave(checklistData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {checklist ? 'Checkliste bearbeiten' : 'Neue Checkliste erstellen'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel der Checkliste"
            />
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibung der Checkliste"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsible">Verantwortlich</Label>
              <Input
                id="responsible"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Name des Verantwortlichen"
              />
            </div>
            <div>
              <Label htmlFor="deputy">Stellvertreter</Label>
              <Input
                id="deputy"
                value={deputy}
                onChange={(e) => setDeputy(e.target.value)}
                placeholder="Name des Stellvertreters"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Neues Tag hinzufügen"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button size="sm" onClick={addTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="template"
              checked={isTemplate}
              onCheckedChange={setIsTemplate}
            />
            <Label htmlFor="template">Als Template speichern</Label>
          </div>

          <div>
            <Label>Wiederkehrend</Label>
            <Select
              value={recurringPattern?.type || 'none'}
              onValueChange={(value) =>
                value === 'none'
                  ? setRecurringPattern(undefined)
                  : setRecurringPattern({ type: value as any, interval: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Wiederholung auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nicht wiederkehrend</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="monthly">Monatlich</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Checklisten-Punkte</h3>
          <Button size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Punkt hinzufügen
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <ChecklistItemEditor
              key={item.id}
              item={item}
              index={index}
              onUpdate={(updates) => updateItem(item.id, updates)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Noch keine Punkte hinzugefügt.</p>
              <p className="text-sm">Klicken Sie auf "Punkt hinzufügen", um zu beginnen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ChecklistItemEditorProps {
  item: ChecklistItem;
  index: number;
  onUpdate: (updates: Partial<ChecklistItem>) => void;
  onRemove: () => void;
}

function ChecklistItemEditor({ item, index, onUpdate, onRemove }: ChecklistItemEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addLink = () => {
    const newLink = {
      id: `link-${Date.now()}`,
      title: 'Neuer Link',
      url: 'https://',
      type: 'external' as const,
    };
    onUpdate({
      links: [...(item.links || []), newLink],
    });
  };

  const updateLink = (linkId: string, updates: any) => {
    onUpdate({
      links: item.links?.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
    });
  };

  const removeLink = (linkId: string) => {
    onUpdate({
      links: item.links?.filter(link => link.id !== linkId),
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex items-start gap-3">
        <span className="text-sm font-medium text-muted-foreground mt-2">
          {index + 1}.
        </span>
        <div className="flex-1 space-y-3">
          <Input
            value={item.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Titel des Punktes"
            className="font-medium"
          />
          
          <Textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Detaillierte Beschreibung (optional)"
            rows={2}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Erweitert
            </Button>
            <Button variant="outline" size="sm" onClick={addLink}>
              <Link className="h-4 w-4 mr-1" />
              Link
            </Button>
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-1" />
              Bild
            </Button>
          </div>

          {showAdvanced && (
            <div className="space-y-3 p-3 bg-muted/50 rounded">
              {item.links && item.links.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Links</Label>
                  {item.links.map((link) => (
                    <div key={link.id} className="flex gap-2">
                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(link.id, { title: e.target.value })}
                        placeholder="Link-Titel"
                        className="flex-1"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        placeholder="URL"
                        className="flex-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLink(link.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
