export function Loading({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-4 ${className ?? ""}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
}

export function Empty({
  message = "暂无内容",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 text-gray-500 ${className ?? ""}`}>
      <p>{message}</p>
    </div>
  );
}

export function ErrorMessage({
  message = "加载失败，请重试",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`border border-red-300 bg-red-50 p-4 rounded text-red-700 ${className ?? ""}`}
    >
      <p>{message}</p>
    </div>
  );
}
