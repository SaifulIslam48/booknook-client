export default function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="py-32 flex justify-center" role="status" aria-label={label}>
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}
