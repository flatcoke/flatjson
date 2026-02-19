export default function PanelHeader({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 bg-surface dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border text-xs text-muted dark:text-dark-text-muted font-medium flex items-center justify-between">
      <span>{children}</span>
      {right}
    </div>
  );
}
