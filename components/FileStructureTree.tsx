import { FileNode } from "@/types";
import { Folder, FileText, FileCode2, Image as ImageIcon, FileWarning } from "lucide-react";

interface Props {
  tree: FileNode[];
}

export function FileStructureTree({ tree }: Props) {
  // Sort tree: folders first, then files alphabetically
  const sortedTree = [...tree].sort((a, b) => {
    if (a.type === b.type) return a.path.localeCompare(b.path);
    return a.type === 'tree' ? -1 : 1;
  });

  const getIcon = (node: FileNode) => {
    if (node.type === 'tree') return <Folder className="w-4 h-4 text-blue-400 fill-blue-400/20" />;
    
    const name = node.path.split('/').pop()?.toLowerCase() || '';
    if (name.includes('readme') || name.includes('license') || name.includes('contributing')) {
      return <FileText className="w-4 h-4 text-amber-400" />;
    }
    if (name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.tsx') || name.endsWith('.jsx')) {
      return <FileCode2 className="w-4 h-4 text-yellow-500" />;
    }
    if (name.endsWith('.json') || name.endsWith('.yml') || name.endsWith('.yaml')) {
      return <FileCode2 className="w-4 h-4 text-green-400" />;
    }
    if (name.match(/\.(png|jpg|jpeg|svg|gif|ico)$/)) {
      return <ImageIcon className="w-4 h-4 text-purple-400" />;
    }
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const getHighlightClass = (node: FileNode) => {
    const name = node.path.split('/').pop()?.toLowerCase() || '';
    if (name.includes('readme') || name.includes('license') || name.includes('package.json')) {
      return "font-medium text-gray-200";
    }
    if (node.path.includes('.github/workflows')) {
      return "font-medium text-blue-300";
    }
    return "text-gray-400";
  };

  if (!tree || tree.length === 0) {
    return <div className="text-gray-500 italic text-sm">No files detected</div>;
  }

  return (
    <div className="font-mono text-sm max-h-[400px] overflow-y-auto w-full p-2 bg-gray-950 rounded-md border border-gray-800 custom-scrollbar">
      {sortedTree.map((node, i) => {
        const depth = node.path.split('/').length - 1;
        const name = node.path.split('/').pop();
        return (
          <div 
            key={i} 
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-800/50 rounded transition-colors group"
            style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
          >
            {getIcon(node)}
            <span className={`truncate ${getHighlightClass(node)} group-hover:text-white transition-colors`}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
