export function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-[32rem] overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-inner">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
