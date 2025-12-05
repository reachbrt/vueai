/**
 * Export utilities for SmartDataTable
 */

export function exportToCSV(data: any[], filename: string = 'data.csv') {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportToJSON(data: any[], filename: string = 'data.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportToExcel(data: any[], filename: string = 'data.xlsx') {
  // For Excel export, we'll use CSV format with .xlsx extension
  // In a real implementation, you'd use a library like xlsx
  exportToCSV(data, filename);
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

