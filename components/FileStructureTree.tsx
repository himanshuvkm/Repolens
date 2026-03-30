import { FileNode } from "@/types";
import { FolderOpen, Folder, File, FileJson, FileType2, Image as ImageIcon } from "lucide-react";

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
    if (node.type === 'tree') {
      return <Folder className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />;
    }
    
    const name = node.path.split('/').pop()?.toLowerCase() || '';
    if (name.endsWith('.json')) {
      return <FileJson className="w-5 h-5 text-on-surface-variant/70 group-hover:text-on-surface-variant transition-colors" />;
    }
    if (name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.tsx') || name.endsWith('.jsx')) {
      return <FileType2 className="w-5 h-5 text-on-surface-variant/70 group-hover:text-on-surface-variant transition-colors" />;
    }
    if (name.match(/\.(png|jpg|jpeg|svg|gif|ico)$/)) {
      return <ImageIcon className="w-5 h-5 text-on-surface-variant/70 group-hover:text-on-surface-variant transition-colors" />;
    }
    return <File className="w-5 h-5 text-on-surface-variant/70 group-hover:text-on-surface-variant transition-colors" />;
  };

  const getFileTypeText = (node: FileNode) => {
    if (node.type === 'tree') return 'Directory';
    const name = node.path.split('/').pop()?.toLowerCase() || '';
    if (name.endsWith('.md')) return 'Markdown';
    if (name.endsWith('.json')) return 'JSON File';
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'TypeScript';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return 'JavaScript';
    if (name.match(/\.(png|jpg|jpeg|svg|gif|ico)$/)) return 'Image';
    return 'File';
  };

  if (!tree || tree.length === 0) {
    return <div className="text-on-surface-variant italic text-sm p-6 text-center">No files detected</div>;
  }

  return (
    <section className="glass rounded-2xl p-6 border border-outline-variant/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2">
          <FolderOpen className="text-primary w-5 h-5" />
          Architecture Map
        </h2>
        <span className="text-[10px] bg-surface-container-high px-2 py-1 rounded-md text-on-surface-variant font-bold uppercase tracking-widest">
          Top Level
        </span>
      </div>
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {sortedTree.slice(0, 50).map((node, i) => {
          const depth = node.path.split('/').length - 1;
          const name = node.path.split('/').pop();
          const isTree = node.type === 'tree';
          
          return (
            <div 
              key={i} 
              className="flex items-center gap-3 px-3 py-2 hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer group"
              style={{ paddingLeft: `${Math.max(0.75, depth * 1.5)}rem` }}
            >
              {getIcon(node)}
              <span className={`text-sm font-medium transition-colors ${isTree ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                {name}
              </span>
              <span className="ml-auto text-xs text-on-surface-variant/50 hidden sm:block">
                {getFileTypeText(node)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
