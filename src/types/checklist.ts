
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  completedBy?: string;
  order: number;
  links?: Array<{
    id: string;
    title: string;
    url: string;
    type: 'internal' | 'external';
  }>;
  images?: Array<{
    id: string;
    url: string;
    alt: string;
    name: string;
  }>;
  orgChart?: Array<{
    id: string;
    name: string;
    role: string;
    children: any[];
  }>;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
  status: 'open' | 'in-progress' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  completedBy?: string;
  responsible?: string;
  deputy?: string;
  tags: string[];
  category: string;
  subcategory?: string;
  isTemplate: boolean;
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  version: number;
  previousVersions?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'reader';
}

export interface Comment {
  id: string;
  checklistId: string;
  itemId?: string;
  userId: string;
  content: string;
  createdAt: Date;
}
