// Utility functions for the VIGILO application

export function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export function distance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

// helper: is same month as now
export function isSameMonthNow(date: Date | string | number | null | undefined) {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function formatWeekRange(date: Date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export function downloadCSV(filename: string, rows: any[]) {
  const header = ["Monitoring Company","License","Completed","UnitPrice","Total"];
  const lines = [header.join(",")].concat(rows.map(r => [r.monitoringCompany, r.license, r.count, r.unitPrice, r.total].join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}