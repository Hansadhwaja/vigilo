const Detail = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-medium">{value || "—"}</p>
  </div>
);

export default Detail;
