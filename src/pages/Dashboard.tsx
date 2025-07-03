
import { useState } from 'react';
import { CheckCircle, Clock, Plus, Filter, Zap, Thermometer, Building, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChecklists } from '../hooks/useChecklists';
import { ChecklistCard } from '../components/ChecklistCard';
import { DashboardStats } from '../components/DashboardStats';
import { useNavigate } from 'react-router-dom';

const categoryIcons = {
  'Messtechnik': Thermometer,
  'Energieabrechnung': Zap,
  'Wartung': Building,
  'Qualitätskontrolle': CheckCircle,
  'Allgemein': Lightbulb,
};

export default function Dashboard() {
  const { checklists, loading, archiveChecklist, restoreChecklist } = useChecklists();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || checklist.status === statusFilter;
    const matchesCategory = activeCategory === 'all' || checklist.category === activeCategory;
    
    return matchesSearch && matchesStatus && matchesCategory && checklist.status !== 'archived';
  });

  // Group checklists by category
  const checklistsByCategory = filteredChecklists.reduce((acc, checklist) => {
    const category = checklist.category || 'Allgemein';
    if (!acc[category]) {
      acc[category] = {};
    }
    
    const subcategory = checklist.subcategory || 'Sonstige';
    if (!acc[category][subcategory]) {
      acc[category][subcategory] = [];
    }
    
    acc[category][subcategory].push(checklist);
    return acc;
  }, {} as Record<string, Record<string, typeof checklists>>);

  const categories = Object.keys(checklistsByCategory);
  const allCategories = [...new Set(checklists.map(c => c.category || 'Allgemein'))];

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
            Kategorisierte Übersicht aller Checklisten
          </p>
        </div>
        <Button className="self-start md:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Neue Checkliste
        </Button>
      </div>

      <DashboardStats checklists={checklists} />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Checklisten durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Kategorie wählen" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {allCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {categories.length > 0 ? (
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-1 h-auto p-1">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Lightbulb;
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex items-center gap-2 text-sm px-3 py-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                {(() => {
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Lightbulb;
                  return <IconComponent className="h-6 w-6 text-primary" />;
                })()}
                <h2 className="text-2xl font-semibold">{category}</h2>
              </div>
              
              {Object.entries(checklistsByCategory[category]).map(([subcategory, subcategoryChecklists]) => (
                <Card key={subcategory} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {subcategory}
                      <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {subcategoryChecklists.length} Checkliste{subcategoryChecklists.length !== 1 ? 'n' : ''}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subcategoryChecklists.map((checklist, index) => (
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
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Keine Checklisten gefunden</h3>
          <p className="mb-4">
            {searchTerm || statusFilter !== 'all' || activeCategory !== 'all'
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
  );
}
