import { FileNode } from "@/types";
import { FolderOpen, Folder, File, FileJson, FileType2, Image as ImageIcon } from "lucide-react";

interface Props {
  tree: FileNode[];
}

export function FileStructureTree({ tree }: Props) {
  const sortedTree = [...tree].sort((a, b) => {
    if (a.type === b.type) return a.path.localeCompare(b.path);
    return a.type === "tree" ? -1 : 1;
  });

  const getIcon = (node: FileNode) => {
    if (node.type === "tree") {
      return <Folder className="h-5 w-5 text-accent transition-colors group-hover:text-ink" />;
    }

    const name = node.path.split("/").pop()?.toLowerCase() || "";
    if (name.endsWith(".json")) return <FileJson className="h-5 w-5 text-muted transition-colors group-hover:text-ink" />;
    if (name.endsWith(".ts") || name.endsWith(".js") || name.endsWith(".tsx") || name.endsWith(".jsx")) {
      return <FileType2 className="h-5 w-5 text-muted transition-colors group-hover:text-ink" />;
    }
    if (name.match(/\.(png|jpg|jpeg|svg|gif|ico)$/)) {
      return <ImageIcon className="h-5 w-5 text-muted transition-colors group-hover:text-ink" />;
    }
    return <File className="h-5 w-5 text-muted transition-colors group-hover:text-ink" />;
  };

  const getFileTypeText = (node: FileNode) => {
    if (node.type === "tree") return "Directory";
    const name = node.path.split("/").pop()?.toLowerCase() || "";
    if (name.endsWith(".md")) return "Markdown";
    if (name.endsWith(".json")) return "JSON File";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "TypeScript";
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "JavaScript";
    if (name.match(/\.(png|jpg|jpeg|svg|gif|ico)$/)) return "Image";
    return "File";
  };

  if (!tree || tree.length === 0) {
    return <div className="p-6 text-center text-sm italic text-muted">No files detected</div>;
  }

  return (
    <section className="panel-card rounded-[1.9rem] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
          <FolderOpen className="h-5 w-5 text-accent" />
          Architecture Map
        </h2>
        <span className="rounded-md border border-frame bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          Top Level
        </span>
      </div>

      <div className="max-h-[400px] space-y-1 overflow-y-auto pr-2">
        {sortedTree.slice(0, 50).map((node, i) => {
          const depth = node.path.split("/").length - 1;
          const name = node.path.split("/").pop();
          const isTree = node.type === "tree";

          return (
            <div
              key={i}
              className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-canvas"
              style={{ paddingLeft: `${Math.max(0.75, depth * 1.5)}rem` }}
            >
              {getIcon(node)}
              <span className={`text-sm font-medium transition-colors ${isTree ? "text-ink" : "text-muted group-hover:text-ink"}`}>
                {name}
              </span>
              <span className="ml-auto hidden text-xs text-muted/70 sm:block">{getFileTypeText(node)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
