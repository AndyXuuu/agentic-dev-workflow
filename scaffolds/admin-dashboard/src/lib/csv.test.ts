import { describe, expect, it } from 'vitest'

import { buildCsv } from './csv'

describe('CSV export boundary', () => {
  it.each(['=2+3', '+SUM(A1:A2)', '-1+2', '@IMPORT'])('neutralizes spreadsheet formula input %s', (value) => {
    expect(buildCsv([[value]])).toBe(`"'${value}"`)
  })

  it('escapes quotes and preserves ordinary content', () => {
    expect(buildCsv([['订单', 'A "quoted" value']])).toBe('"订单","A ""quoted"" value"')
  })
})
