
import { useState } from 'react';
import { CheckCircle, Clock, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChecklists } from '../hooks/useChecklists';
import { ChecklistCard } from '../components/ChecklistCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { checklists, loading, archiveChecklist, restoreChecklist } = useChecklists();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || checklist.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const recentChecklists = filteredChecklists
    .filter(c => c.status !== 'archived')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Übersicht über alle Checklisten und deren Status
          </p>
        </div>
        <Button className="self-start md:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Neue Checkliste
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Checklisten durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status filter" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="open">Offen</SelectItem>
            <SelectItem value="in-progress">In Bearbeitung</SelectItem>
            <SelectItem value="completed">Abgeschlossen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Aktuelle Checklisten</h2>
        </div>
        {recentChecklists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentChecklists.map((checklist, index) => (
              <div
                key={checklist.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ChecklistCard
                  checklist={checklist}
                  onArchive={archiveChecklist}
                  onRestore={restoreChecklist}
                  onClick={(id) => navigate(`/checklist/${id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Keine Checklisten gefunden</h3>
            <p className="mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
                : 'Erstellen Sie Ihre erste Checkliste, um loszulegen.'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neue Checkliste erstellen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
