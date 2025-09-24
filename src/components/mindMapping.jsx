"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Edit3, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Palette
} from 'lucide-react';

const MindMap = ({ onClose, onSave, initialData = null }) => {
  const [nodes, setNodes] = useState(initialData?.nodes || []);
  const [connections, setConnections] = useState(initialData?.connections || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
    const [editingNode, setEditingNode] = useState(null);
  const [editText, setEditText] = useState('');

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Initialize with a central node if empty
  useEffect(() => {
    if (nodes.length === 0) {
      const centerNode = {
        id: '1',
        text: 'Central Idea',
        x: 400,
        y: 300,
        color: '#3b82f6'
      };
      setNodes([centerNode]);
    }
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.save();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const gridSize = 20 * zoom;
    const offsetX = (canvas.width / 2) % gridSize;
    const offsetY = (canvas.height / 2) % gridSize;
    
    // Vertical lines
    for (let x = offsetX; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = offsetY; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
    
    // Apply zoom
    ctx.save();
    ctx.scale(zoom, zoom);
    
    // Draw connections
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const radius = 40;
      
      // Node shadow
      if (!isSelected) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
      }
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      
      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Node text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text
      const maxWidth = radius * 1.5;
      const words = node.text.split(' ');
      let line = '';
      let y = node.y;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, node.x, y);
          line = words[i] + ' ';
          y += 16;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, node.x, y);
    });
    
    ctx.restore();
  }, [nodes, connections, selectedNode, zoom]);

  const addNode = () => {
    if (!selectedNode) {
      alert('Please select a node first');
      return;
    }
    
    const parentNode = nodes.find(n => n.id === selectedNode);
    if (!parentNode) return;
    
    const newId = Date.now().toString();
    const angle = (nodes.length - 1) * (Math.PI / 4); // Spread nodes evenly
    const distance = 150;
    
    const newNode = {
      id: newId,
      text: 'New Idea',
      x: parentNode.x + Math.cos(angle) * distance,
      y: parentNode.y + Math.sin(angle) * distance,
      color: colors[nodes.length % colors.length]
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setConnections(prevConnections => [...prevConnections, { from: selectedNode, to: newId }]);
    setSelectedNode(newId); // Auto-select the new node
  };

  const handleCanvasClick = (e) => {
    if (editingNode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < 40; // 40 is the node radius
    });
    
    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCanvasDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < 40;
    });
    
    if (clickedNode) {
      setEditingNode(clickedNode.id);
      setEditText(clickedNode.text);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < 40;
    });
    
    if (clickedNode) {
      setIsDragging(true);
      setSelectedNode(clickedNode.id);
      setDragOffset({
        x: x - clickedNode.x,
        y: y - clickedNode.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedNode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setNodes(nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, x: x - dragOffset.x, y: y - dragOffset.y }
        : node
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const deleteNode = () => {
    if (!selectedNode || nodes.length === 1) return;
    
    setNodes(nodes.filter(node => node.id !== selectedNode));
    setConnections(connections.filter(
      conn => conn.from !== selectedNode && conn.to !== selectedNode
    ));
    setSelectedNode(null);
  };

  const saveEdit = () => {
    if (!editingNode || !editText.trim()) return;
    
    setNodes(nodes.map(node => 
      node.id === editingNode 
        ? { ...node, text: editText.trim() }
        : node
    ));
    setEditingNode(null);
    setEditText('');
  };

  const changeNodeColor = (color) => {
    if (!selectedNode) return;
    
    setNodes(nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, color }
        : node
    ));
  };

  const resetView = () => {
    setZoom(1);
    const canvas = canvasRef.current;
    if (canvas && nodes.length > 0) {
      const firstNode = nodes[0];
      setNodes(nodes.map((node, index) => ({
        ...node,
        x: index === 0 ? canvas.width / 2 / zoom : node.x,
        y: index === 0 ? canvas.height / 2 / zoom : node.y
      })));
    }
  };

  const exportMindMap = () => {
    const dataStr = JSON.stringify({ nodes, connections }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `mindmap-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-6xl h-[85vh] flex flex-col shadow-xl border border-border">
        {/* Simplified Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <h2 className="text-lg font-semibold text-foreground">Mind Map</h2>
          
          <div className="flex items-center gap-2">
            {/* Main Actions */}
            <button
              onClick={addNode}
              disabled={!selectedNode}
              className={`px-3 py-1.5 text-sm flex items-center gap-1 rounded-lg transition-colors ${
                selectedNode 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>
            
            <button
              onClick={deleteNode}
              disabled={!selectedNode || nodes.length === 1}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedNode && nodes.length > 1
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-border" />
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1.5 hover:bg-muted rounded transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-1.5 hover:bg-muted rounded transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="Reset view"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-border" />
            
            {/* Color Picker */}
            {selectedNode && (
              <div className="flex gap-1">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => changeNodeColor(color)}
                    className="w-6 h-6 rounded hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
            
            <div className="w-px h-6 bg-border" />
            
            {/* Save/Export */}
            <button
              onClick={exportMindMap}
              className="px-3 py-1.5 text-sm hover:bg-muted rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onSave({ nodes, connections })}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-background">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />
          
          {/* Edit Dialog */}
          {editingNode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
                <h3 className="text-sm font-semibold mb-3">Edit Node</h3>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') setEditingNode(null);
                  }}
                  className="w-64 px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Node text"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingNode(null);
                      setEditText('');
                    }}
                    className="flex-1 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Help Text */}
          <div className="absolute bg-slate-900 text-b text-white bottom-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground">
            Click to select • Double-click to edit • Drag to move
          </div>
          
          {/* Selected Node Indicator */}
          {selectedNode && (
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-sm">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-medium text-foreground">
                {nodes.find(n => n.id === selectedNode)?.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMap;