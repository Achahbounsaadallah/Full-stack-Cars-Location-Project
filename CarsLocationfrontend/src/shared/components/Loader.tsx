export default function Loader({ label = 'Chargement...' }: { label?: string }) {
  return (
    <div className="state" role="status">
      {label}
    </div>
  )
}
