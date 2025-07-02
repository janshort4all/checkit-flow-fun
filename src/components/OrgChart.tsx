
import { useState } from 'react';
import { Plus, X, Users, ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  children: OrgNode[];
}

interface OrgChartProps {
  data: OrgNode[];
  onUpdate: (data: OrgNode[]) => void;
  editable?: boolean;
}

export function OrgChart({ data, onUpdate, editable = false }: OrgChartProps) {
  const [editingNode, setEditingNode] = useState<string | null>(null);

  const addNode = (parentId?: string) => {
    const newNode: OrgNode = {
      id: `node-${Date.now()}`,
      name: 'Neue Position',
      role: 'Rolle eingeben',
      children: []
    };

    if (!parentId) {
      onUpdate([...data, newNode]);
    } else {
      const updateNode = (nodes: OrgNode[]): OrgNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] };
          }
          return { ...node, children: updateNode(node.children) };
        });
      };
      onUpdate(updateNode(data));
    }
  };

  const removeNode = (nodeId: string) => {
    const removeFromNodes = (nodes: OrgNode[]): OrgNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({ ...node, children: removeFromNodes(node.children) }));
    };
    onUpdate(removeFromNodes(data));
  };

  const updateNode = (nodeId: string, updates: Partial<OrgNode>) => {
    const updateInNodes = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        return { ...node, children: updateInNodes(node.children) };
      });
    };
    onUpdate(updateInNodes(data));
  };

  const renderNode = (node: OrgNode, level = 0) => (
    <div key={node.id} className="flex flex-col items-center">
      <Card className="p-3 min-w-[120px] text-center relative group">
        {editingNode === node.id ? (
          <div className="space-y-2">
            <Input
              value={node.name}
              onChange={(e) => updateNode(node.id, { name: e.target.value })}
              className="text-sm"
              placeholder="Name"
            />
            <Input
              value={node.role}
              onChange={(e) => updateNode(node.id, { role: e.target.value })}
              className="text-xs"
              placeholder="Rolle"
            />
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setEditingNode(null)}>
                ✓
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-medium text-sm">{node.name}</div>
            <div className="text-xs text-muted-foreground">{node.role}</div>
            {editable && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={() => setEditingNode(node.id)}
                >
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={() => addNode(node.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={() => removeNode(node.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {node.children.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          <ArrowDown className="h-4 w-4 text-muted-foreground mb-2" />
          <div className="flex gap-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Organigramm</span>
        </div>
        {editable && (
          <Button size="sm" onClick={() => addNode()}>
            <Plus className="h-4 w-4 mr-1" />
            Position
          </Button>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Noch kein Organigramm erstellt.</p>
          {editable && (
            <Button size="sm" className="mt-2" onClick={() => addNode()}>
              Erste Position hinzufügen
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-4 justify-center">
            {data.map(node => renderNode(node))}
          </div>
        </div>
      )}
    </div>
  );
}
