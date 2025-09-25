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
  Palette,
  Menu,
  ChevronDown
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState(null);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize with a central node if empty
  useEffect(() => {
    if (nodes.length === 0) {
      const canvas = canvasRef.current;
      const centerX = canvas ? canvas.width / 2 : 400;
      const centerY = canvas ? canvas.height / 2 : 300;
      
      const centerNode = {
        id: '1',
        text: 'Central Idea',
        x: centerX,
        y: centerY,
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
      const radius = isMobile ? 30 : 40;
      
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
      ctx.font = `bold ${isMobile ? '12px' : '14px'} system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text
      const maxWidth = radius * 1.5;
      const words = node.text.split(' ');
      let line = '';
      let y = node.y;
      const lineHeight = isMobile ? 14 : 16;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, node.x, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, node.x, y);
    });
    
    ctx.restore();
  }, [nodes, connections, selectedNode, zoom, isMobile]);

  const addNode = () => {
    if (!selectedNode) {
      alert('Please select a node first');
      return;
    }
    
    const parentNode = nodes.find(n => n.id === selectedNode);
    if (!parentNode) return;
    
    const newId = Date.now().toString();
    const angle = (nodes.length - 1) * (Math.PI / 4);
    const distance = isMobile ? 100 : 150;
    
    const newNode = {
      id: newId,
      text: 'New Idea',
      x: parentNode.x + Math.cos(angle) * distance,
      y: parentNode.y + Math.sin(angle) * distance,
      color: colors[nodes.length % colors.length]
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setConnections(prevConnections => [...prevConnections, { from: selectedNode, to: newId }]);
    setSelectedNode(newId);
  };

  const handleCanvasClick = (e) => {
    if (editingNode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < (isMobile ? 30 : 40);
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
      return distance < (isMobile ? 30 : 40);
    });
    
    if (clickedNode) {
      setEditingNode(clickedNode.id);
      setEditText(clickedNode.text);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / zoom;
      const y = (touch.clientY - rect.top) / zoom;
      
      setTouchStartPos({ x: touch.clientX, y: touch.clientY, time: Date.now() });
      
      const clickedNode = nodes.find(node => {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
        return distance < (isMobile ? 30 : 40);
      });
      
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
        setIsDragging(true);
        setDragOffset({
          x: x - clickedNode.x,
          y: y - clickedNode.y
        });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && selectedNode && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / zoom;
      const y = (touch.clientY - rect.top) / zoom;
      
      setNodes(nodes.map(node => 
        node.id === selectedNode 
          ? { ...node, x: x - dragOffset.x, y: y - dragOffset.y }
          : node
      ));
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartPos && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const timeDiff = Date.now() - touchStartPos.time;
      const distance = Math.sqrt(
        Math.pow(touch.clientX - touchStartPos.x, 2) + 
        Math.pow(touch.clientY - touchStartPos.y, 2)
      );
      
      // Double tap detection
      if (timeDiff < 300 && distance < 10 && selectedNode) {
        const node = nodes.find(n => n.id === selectedNode);
        if (node) {
          setEditingNode(selectedNode);
          setEditText(node.text);
        }
      }
    }
    
    setIsDragging(false);
    setTouchStartPos(null);
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < (isMobile ? 30 : 40);
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
    setShowColorPicker(false);
  };

  const resetView = () => {
    setZoom(1);
    const canvas = canvasRef.current;
    if (canvas && nodes.length > 0) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Center the first node
      if (nodes.length > 0) {
        const firstNode = nodes[0];
        const offsetX = centerX - firstNode.x * zoom;
        const offsetY = centerY - firstNode.y * zoom;
        
        setNodes(nodes.map(node => ({
          ...node,
          x: node.x + offsetX / zoom,
          y: node.y + offsetY / zoom
        })));
      }
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-card rounded-xl w-full max-w-6xl h-[90vh] sm:h-[85vh] flex flex-col shadow-xl border border-border">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-border bg-card">
          {/* Mobile Header */}
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-lg font-semibold text-foreground">Mind Map</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
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

          {/* Mobile Action Menu */}
          {showMobileMenu && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg md:hidden space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={addNode}
                  disabled={!selectedNode}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    selectedNode 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                
                <button
                  onClick={deleteNode}
                  disabled={!selectedNode || nodes.length === 1}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    selectedNode && nodes.length > 1
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                
                <button
                  onClick={() => onSave({ nodes, connections })}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
              
              {/* Mobile Zoom Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-muted rounded-lg"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-2 bg-muted rounded-lg"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 bg-muted rounded-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              
              {/* Mobile Color Picker */}
              {selectedNode && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  <div className="flex gap-1">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => changeNodeColor(color)}
                        className="w-8 h-8 rounded hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-background">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move touch-none"
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />
          
          {/* Edit Dialog */}
          {editingNode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
              <div className="bg-card p-4 rounded-lg shadow-lg border border-border w-full max-w-sm">
                <h3 className="text-sm font-semibold mb-3">Edit Node</h3>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') {
                      setEditingNode(null);
                      setEditText('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Node text"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingNode(null);
                      setEditText('');
                    }}
                    className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Help Text - Desktop Only */}
          <div className="hidden sm:block absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground">
            Click to select • Double-click to edit • Drag to move
          </div>
          
          {/* Mobile Help Text */}
          <div className="sm:hidden bg-slate-950 text-slate-500 absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground text-center">
            Tap to select • Double-tap to edit • Drag to move
          </div>
          
          {/* Selected Node Indicator */}
          {selectedNode && (
            <div className="absolute bg-slate-950 text-slate-500 top-4 left-4 right-4 sm:right-auto bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-sm">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-medium text-white line-clamp-1">
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