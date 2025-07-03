
import { useState, useEffect } from 'react';
import { Checklist, ChecklistItem } from '../types/checklist';

// Mock data for demonstration
const mockChecklists: Checklist[] = [
  {
    id: '1',
    title: 'Projekt Setup Checkliste',
    description: 'Grundlegende Schritte für ein neues Projekt',
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    responsible: 'Max Mustermann',
    deputy: 'Anna Schmidt',
    tags: ['projekt', 'setup', 'entwicklung'],
    isTemplate: false,
    version: 1,
    items: [
      {
        id: '1-1',
        title: 'Repository erstellen',
        description: 'Neues Git-Repository auf GitHub anlegen und grundlegende Struktur einrichten',
        completed: true,
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-16'),
        completedBy: 'Max Mustermann',
        order: 1,
        images: [
          {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            alt: 'GitHub Repository Screenshot',
            name: 'github-repo.png'
          }
        ],
        links: [
          {
            id: 'link-1',
            title: 'GitHub Repository',
            url: 'https://github.com/company/project',
            type: 'external'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Entwicklungsumgebung konfigurieren',
        description: 'IDE einrichten, Extensions installieren, Linter und Formatter konfigurieren',
        completed: true,
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-17'),
        completedBy: 'Max Mustermann',
        order: 2,
        images: [
          {
            id: 'img-2',
            url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
            alt: 'Laptop mit Code',
            name: 'laptop-code.jpg'
          },
          {
            id: 'img-3',
            url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
            alt: 'Circuit Board',
            name: 'circuit-board.jpg'
          }
        ],
        links: [
          {
            id: 'link-2',
            title: 'VS Code Settings',
            url: '/docs/vscode-setup.md',
            type: 'internal'
          },
          {
            id: 'link-3',
            title: 'ESLint Config',
            url: 'https://eslint.org/docs/user-guide/configuring',
            type: 'external'
          }
        ]
      },
      {
        id: '1-3',
        title: 'CI/CD Pipeline einrichten',
        description: 'GitHub Actions für automatisierte Tests und Deployment konfigurieren',
        completed: false,
        createdAt: new Date('2024-01-15'),
        order: 3,
        orgChart: [
          {
            id: 'org-1',
            name: 'DevOps Team',
            role: 'Team Lead',
            children: [
              {
                id: 'org-2',
                name: 'CI/CD Engineer',
                role: 'Pipeline Setup',
                children: []
              },
              {
                id: 'org-3',
                name: 'Security Engineer',
                role: 'Security Review',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '1-4',
        title: 'Dokumentation erstellen',
        description: 'README, API-Dokumentation und Entwicklerhandbuch schreiben',
        completed: false,
        createdAt: new Date('2024-01-15'),
        order: 4,
        images: [
          {
            id: 'img-4',
            url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
            alt: 'Frau arbeitet am Laptop',
            name: 'woman-laptop.jpg'
          }
        ],
        links: [
          {
            id: 'link-4',
            title: 'Dokumentation Template',
            url: '/templates/documentation.md',
            type: 'internal'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Wöchentliche Code Review',
    description: 'Standardprozess für wöchentliche Code-Reviews',
    status: 'open',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    responsible: 'Anna Schmidt',
    deputy: 'Tom Weber',
    tags: ['review', 'qualität', 'wöchentlich'],
    isTemplate: true,
    recurringPattern: {
      type: 'weekly',
      interval: 1
    },
    version: 1,
    items: [
      {
        id: '2-1',
        title: 'Pull Requests überprüfen',
        description: 'Alle offenen Pull Requests der Woche durchgehen',
        completed: false,
        createdAt: new Date('2024-01-22'),
        order: 1,
        images: [
          {
            id: 'img-5',
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
            alt: 'Code Review am Computer',
            name: 'code-review.jpg'
          }
        ],
        links: [
          {
            id: 'link-5',
            title: 'PR Review Checklist',
            url: '/docs/pr-review-checklist.md',
            type: 'internal'
          }
        ],
        orgChart: [
          {
            id: 'org-4',
            name: 'Review Team',
            role: 'Code Review',
            children: [
              {
                id: 'org-5',
                name: 'Senior Developer',
                role: 'Technical Review',
                children: []
              },
              {
                id: 'org-6',
                name: 'Junior Developer',
                role: 'Learning Review',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '2-2',
        title: 'Code-Qualität bewerten',
        description: 'Metriken überprüfen und Verbesserungsvorschläge dokumentieren',
        completed: false,
        createdAt: new Date('2024-01-22'),
        order: 2,
      },
      {
        id: '2-3',
        title: 'Team-Feedback sammeln',
        description: 'Feedback der Entwickler zu Code-Standards einholen',
        completed: false,
        createdAt: new Date('2024-01-22'),
        order: 3,
      }
    ]
  },
  {
    id: '3',
    title: 'Deployment Prozess',
    description: 'Schritte für sichere Produktions-Deployments',
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    completedAt: new Date('2024-01-18'),
    completedBy: 'Tom Weber',
    responsible: 'Tom Weber',
    deputy: 'Max Mustermann',
    tags: ['deployment', 'produktion', 'sicherheit'],
    isTemplate: false,
    version: 1,
    items: [
      {
        id: '3-1',
        title: 'Tests ausführen',
        description: 'Vollständige Testsuite durchlaufen lassen',
        completed: true,
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-15'),
        completedBy: 'Tom Weber',
        order: 1,
        images: [
          {
            id: 'img-6',
            url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
            alt: 'Test Results Dashboard',
            name: 'test-results.jpg'
          }
        ],
        links: [
          {
            id: 'link-6',
            title: 'Test Report',
            url: '/reports/test-results.html',
            type: 'internal'
          },
          {
            id: 'link-7',
            title: 'CI Dashboard',
            url: 'https://ci.company.com/dashboard',
            type: 'external'
          }
        ]
      },
      {
        id: '3-2',
        title: 'Staging-Umgebung testen',
        description: 'Funktionalität in Staging-Umgebung validieren',
        completed: true,
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-16'),
        completedBy: 'Tom Weber',
        order: 2,
        orgChart: [
          {
            id: 'org-7',
            name: 'QA Team',
            role: 'Quality Assurance',
            children: [
              {
                id: 'org-8',
                name: 'QA Engineer',
                role: 'Manual Testing',
                children: []
              },
              {
                id: 'org-9',
                name: 'Automation Engineer',
                role: 'Automated Testing',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '3-3',
        title: 'Backup erstellen',
        description: 'Vollständiges Backup der Produktionsdatenbank',
        completed: true,
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-17'),
        completedBy: 'Tom Weber',
        order: 3,
      },
      {
        id: '3-4',
        title: 'Deployment durchführen',
        description: 'Code in Produktionsumgebung deployen',
        completed: true,
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-18'),
        completedBy: 'Tom Weber',
        order: 4,
        images: [
          {
            id: 'img-7',
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            alt: 'Deployment Dashboard',
            name: 'deployment.jpg'
          },
          {
            id: 'img-8',
            url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
            alt: 'Server Monitoring',
            name: 'monitoring.jpg'
          },
          {
            id: 'img-9',
            url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
            alt: 'Production Environment',
            name: 'production.jpg'
          }
        ],
        links: [
          {
            id: 'link-8',
            title: 'Production Dashboard',
            url: 'https://prod.company.com/dashboard',
            type: 'external'
          },
          {
            id: 'link-9',
            title: 'Deployment Guide',
            url: '/docs/deployment-guide.md',
            type: 'internal'
          }
        ],
        orgChart: [
          {
            id: 'org-10',
            name: 'Deployment Team',
            role: 'Operations',
            children: [
              {
                id: 'org-11',
                name: 'DevOps Engineer',
                role: 'Infrastructure',
                children: []
              },
              {
                id: 'org-12',
                name: 'SRE Engineer',
                role: 'Site Reliability',
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];

export const useChecklists = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChecklists(mockChecklists);
      setLoading(false);
    }, 500);
  }, []);

  const toggleItemComplete = (checklistId: string, itemId: string) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map(item => {
            if (item.id === itemId) {
              const isCompleting = !item.completed;
              return {
                ...item,
                completed: isCompleting,
                completedAt: isCompleting ? new Date() : undefined,
                completedBy: isCompleting ? 'Aktueller Benutzer' : undefined,
              };
            }
            return item;
          });

          // Update checklist status based on item completion
          const completedItems = updatedItems.filter(item => item.completed).length;
          const totalItems = updatedItems.length;
          let newStatus: Checklist['status'] = 'open';
          
          if (completedItems === totalItems) {
            newStatus = 'completed';
          } else if (completedItems > 0) {
            newStatus = 'in-progress';
          }

          return {
            ...checklist,
            items: updatedItems,
            status: newStatus,
            updatedAt: new Date(),
            completedAt: newStatus === 'completed' ? new Date() : undefined,
            completedBy: newStatus === 'completed' ? 'Aktueller Benutzer' : undefined,
          };
        }
        return checklist;
      })
    );
  };

  const updateChecklist = (checklistId: string, updates: Partial<Checklist>) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist =>
        checklist.id === checklistId
          ? { 
              ...checklist, 
              ...updates, 
              updatedAt: new Date(),
              version: checklist.version + 1 
            }
          : checklist
      )
    );
  };

  const createChecklist = (checklistData: Partial<Checklist>) => {
    const newChecklist: Checklist = {
      id: `checklist-${Date.now()}`,
      title: checklistData.title || '',
      description: checklistData.description,
      items: checklistData.items || [],
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      responsible: checklistData.responsible,
      deputy: checklistData.deputy,
      tags: checklistData.tags || [],
      isTemplate: checklistData.isTemplate || false,
      recurringPattern: checklistData.recurringPattern,
      version: 1,
      ...checklistData,
    };
    
    setChecklists(prevChecklists => [...prevChecklists, newChecklist]);
    return newChecklist;
  };

  const archiveChecklist = (checklistId: string) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist =>
        checklist.id === checklistId
          ? { ...checklist, status: 'archived' as const, updatedAt: new Date() }
          : checklist
      )
    );
  };

  const restoreChecklist = (checklistId: string) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist => {
        if (checklist.id === checklistId) {
          const completedItems = checklist.items.filter(item => item.completed).length;
          const totalItems = checklist.items.length;
          let status: Checklist['status'] = 'open';
          
          if (completedItems === totalItems) {
            status = 'completed';
          } else if (completedItems > 0) {
            status = 'in-progress';
          }

          return { ...checklist, status, updatedAt: new Date() };
        }
        return checklist;
      })
    );
  };

  return {
    checklists,
    loading,
    toggleItemComplete,
    updateChecklist,
    createChecklist,
    archiveChecklist,
    restoreChecklist,
  };
};
