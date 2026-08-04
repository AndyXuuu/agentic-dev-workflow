function neutralizeFormula(value: string) {
  return /^\s*[=+\-@]/.test(value) ? `'${value}` : value
}

export function buildCsv(rows: string[][]) {
  return rows
    .map((row) => row.map((cell) => `"${neutralizeFormula(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n')
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = buildCsv(rows)
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
