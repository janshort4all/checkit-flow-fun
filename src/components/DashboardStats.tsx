
import { CheckCircle, Clock, Archive, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checklist } from '../types/checklist';

interface DashboardStatsProps {
  checklists: Checklist[];
}

export function DashboardStats({ checklists }: DashboardStatsProps) {
  const stats = {
    total: checklists.length,
    completed: checklists.filter(c => c.status === 'completed').length,
    inProgress: checklists.filter(c => c.status === 'in-progress').length,
    archived: checklists.filter(c => c.status === 'archived').length,
  };

  const statCards = [
    {
      title: 'Gesamt',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'In Bearbeitung',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Abgeschlossen',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Archiviert',
      value: stats.archived,
      icon: Archive,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
