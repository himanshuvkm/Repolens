interface Props {
  languages: Record<string, number>;
}

// GitHub language colors (subset)
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dockerfile: '#384d54',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

const getLanguageColor = (lang: string) => languageColors[lang] || '#8b949e';

export function LanguageBar({ languages }: Props) {
  if (!languages || Object.keys(languages).length === 0) {
    return <div className="text-gray-500 italic text-sm">No languages detected</div>;
  }

  const entries = Object.entries(languages);
  const totalBytes = entries.reduce((acc, [_, bytes]) => acc + bytes, 0);
  
  const sortedEntries = entries
    .map(([lang, bytes]) => ({ lang, percent: (bytes / totalBytes) * 100 }))
    .sort((a, b) => b.percent - a.percent);

  return (
    <div className="w-full">
      <div className="flex h-3 w-full rounded-full overflow-hidden flex-nowrap bg-gray-800">
        {sortedEntries.map((item) => (
          <div
            key={item.lang}
            style={{ width: `${item.percent}%`, backgroundColor: getLanguageColor(item.lang) }}
            className="h-full transition-all duration-1000 hover:opacity-80"
            title={`${item.lang}: ${item.percent.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-medium">
        {sortedEntries.slice(0, 6).map((item) => (
          <div key={item.lang} className="flex items-center gap-1.5">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: getLanguageColor(item.lang) }} 
            />
            <span className="text-gray-300">{item.lang}</span>
            <span className="text-gray-500">{item.percent.toFixed(1)}%</span>
          </div>
        ))}
        {sortedEntries.length > 6 && (
          <div className="flex items-center gap-1.5 text-gray-500">
            <span>Other ({(sortedEntries.slice(6).reduce((acc, curr) => acc + curr.percent, 0)).toFixed(1)}%)</span>
          </div>
        )}
      </div>
    </div>
  );
}
