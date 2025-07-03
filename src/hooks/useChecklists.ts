import { useState, useEffect } from 'react';
import { Checklist, ChecklistItem } from '../types/checklist';

// Mock data for demonstration
const mockChecklists: Checklist[] = [
  {
    id: '1',
    title: 'Thermografie Prüfung Schaltschrank',
    description: 'Wärmebildaufnahmen und Analyse von Schaltschränken',
    category: 'Messtechnik',
    subcategory: 'Thermografie',
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    responsible: 'Max Mustermann',
    deputy: 'Anna Schmidt',
    tags: ['thermografie', 'schaltschrank', 'wärmebildkamera'],
    isTemplate: false,
    version: 1,
    items: [
      {
        id: '1-1',
        title: 'Wärmebildkamera kalibrieren',
        description: 'Kamera auf Umgebungstemperatur einstellen und Referenzmessung durchführen',
        completed: true,
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-16'),
        completedBy: 'Max Mustermann',
        order: 1,
        images: [
          {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
            alt: 'Wärmebildkamera Setup',
            name: 'thermal-camera.jpg'
          }
        ],
        links: [
          {
            id: 'link-1',
            title: 'Kalibrierungsprotokoll',
            url: '/docs/calibration-protocol.pdf',
            type: 'internal'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Schaltschrank thermisch vermessen',
        description: 'Systematische Aufnahme aller Komponenten und Verbindungen',
        completed: false,
        createdAt: new Date('2024-01-15'),
        order: 2,
        images: [
          {
            id: 'img-2',
            url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
            alt: 'Schaltschrank Thermografie',
            name: 'switchgear-thermal.jpg'
          }
        ],
        orgChart: [
          {
            id: 'org-1',
            name: 'Messtechnik Team',
            role: 'Durchführung',
            children: [
              {
                id: 'org-2',
                name: 'Thermografie Spezialist',
                role: 'Messung',
                children: []
              },
              {
                id: 'org-3',
                name: 'Elektrotechniker',
                role: 'Sicherheit',
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Staubmessung Arbeitsplatz',
    description: 'Messung der Staubkonzentration am Arbeitsplatz',
    category: 'Messtechnik',
    subcategory: 'Staubmessung',
    status: 'open',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    responsible: 'Anna Schmidt',
    deputy: 'Tom Weber',
    tags: ['staub', 'arbeitsplatz', 'messung'],
    isTemplate: true,
    version: 1,
    items: [
      {
        id: '2-1',
        title: 'Messgeräte vorbereiten',
        description: 'Staubmessgerät kalibrieren und Probenahme vorbereiten',
        completed: false,
        createdAt: new Date('2024-01-22'),
        order: 1,
        images: [
          {
            id: 'img-4',
            url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
            alt: 'Staubmessgerät',
            name: 'dust-meter.jpg'
          }
        ],
        links: [
          {
            id: 'link-4',
            title: 'Messprotokoll Vorlage',
            url: '/templates/dust-measurement.xlsx',
            type: 'internal'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Erdgas Abrechnung Q1',
    description: 'Quartalsabrechnung für Erdgasverbrauch',
    category: 'Energieabrechnung',
    subcategory: 'Erdgas',
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    completedAt: new Date('2024-01-18'),
    completedBy: 'Tom Weber',
    responsible: 'Tom Weber',
    deputy: 'Max Mustermann',
    tags: ['erdgas', 'abrechnung', 'quartalsabschluss'],
    isTemplate: false,
    version: 1,
    items: [
      {
        id: '3-1',
        title: 'Zählerstände erfassen',
        description: 'Alle Gaszähler ablesen und dokumentieren',
        completed: true,
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-15'),
        completedBy: 'Tom Weber',
        order: 1,
        images: [
          {
            id: 'img-5',
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
            alt: 'Gaszähler Ablesung',
            name: 'gas-meter.jpg'
          }
        ],
        links: [
          {
            id: 'link-5',
            title: 'Zählerstand Formular',
            url: '/forms/gas-meter-reading.pdf',
            type: 'internal'
          }
        ]
      },
      {
        id: '3-2',
        title: 'Verbrauch berechnen',
        description: 'Differenz zum Vormonat berechnen und Kosten ermitteln',
        completed: true,
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-16'),
        completedBy: 'Tom Weber',
        order: 2,
        orgChart: [
          {
            id: 'org-4',
            name: 'Abrechnungsteam',
            role: 'Berechnung',
            children: [
              {
                id: 'org-5',
                name: 'Energiecontroller',
                role: 'Analyse',
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Stromabrechnung Hauptgebäude',
    description: 'Monatliche Stromkostenabrechnung',
    category: 'Energieabrechnung',
    subcategory: 'Strom',
    status: 'in-progress',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    responsible: 'Anna Schmidt',
    deputy: 'Tom Weber',
    tags: ['strom', 'abrechnung', 'hauptgebäude'],
    isTemplate: true,
    recurringPattern: {
      type: 'monthly',
      interval: 1
    },
    version: 1,
    items: [
      {
        id: '4-1',
        title: 'Stromzähler ablesen',
        description: 'Hauptzähler und Unterzähler dokumentieren',
        completed: true,
        createdAt: new Date('2024-01-25'),
        completedAt: new Date('2024-01-26'),
        completedBy: 'Anna Schmidt',
        order: 1,
        images: [
          {
            id: 'img-6',
            url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
            alt: 'Stromzähler',
            name: 'electricity-meter.jpg'
          },
          {
            id: 'img-7',
            url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop',
            alt: 'Zählerstand Dokumentation',
            name: 'meter-documentation.jpg'
          }
        ],
        links: [
          {
            id: 'link-6',
            title: 'Stromzähler Übersicht',
            url: '/docs/electricity-meters.pdf',
            type: 'internal'
          },
          {
            id: 'link-7',
            title: 'Online Verbrauchsdaten',
            url: 'https://portal.energieversorger.de',
            type: 'external'
          }
        ]
      },
      {
        id: '4-2',
        title: 'Kostenverteilung berechnen',
        description: 'Verbrauch auf Kostenstellen aufteilen',
        completed: false,
        createdAt: new Date('2024-01-25'),
        order: 2,
        orgChart: [
          {
            id: 'org-6',
            name: 'Controlling',
            role: 'Kostenaufteilung',
            children: [
              {
                id: 'org-7',
                name: 'Buchhalter',
                role: 'Kostenstellen',
                children: []
              },
              {
                id: 'org-8',
                name: 'Controller',
                role: 'Analyse',
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Wartung Klimaanlage Block A',
    description: 'Regelmäßige Wartung der Klimaanlage',
    category: 'Wartung',
    subcategory: 'Klimatechnik',
    status: 'open',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    responsible: 'Max Mustermann',
    deputy: 'Anna Schmidt',
    tags: ['wartung', 'klimaanlage', 'block-a'],
    isTemplate: true,
    recurringPattern: {
      type: 'monthly',
      interval: 3
    },
    version: 1,
    items: [
      {
        id: '5-1',
        title: 'Filter prüfen und tauschen',
        description: 'Luftfilter auf Verschmutzung prüfen und bei Bedarf erneuern',
        completed: false,
        createdAt: new Date('2024-01-28'),
        order: 1,
        images: [
          {
            id: 'img-8',
            url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
            alt: 'Klimaanlage Filter',
            name: 'hvac-filter.jpg'
          }
        ],
        links: [
          {
            id: 'link-8',
            title: 'Wartungsprotokoll',
            url: '/docs/hvac-maintenance.pdf',
            type: 'internal'
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
      category: checklistData.category || 'Allgemein',
      subcategory: checklistData.subcategory,
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
