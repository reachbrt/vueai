import type { TableSchema, TableColumn, ExtractedTable, TableExtractionOptions } from '../types';
import { inferSchema, inferColumnType } from './helpers';

/**
 * Extract table data from DOM (HTML tables)
 */
export function extractFromDOM(options: TableExtractionOptions = {}): ExtractedTable | null {
  const {
    selector = 'table',
    includeHeaders = true,
    maxRows,
    inferTypes = true,
    skipEmptyRows = true,
  } = options;

  // Find table element
  const tableElement = document.querySelector(selector);
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    console.warn(`No table found with selector: ${selector}`);
    return null;
  }

  const table = tableElement as HTMLTableElement;
  const rows = Array.from(table.rows);
  
  if (rows.length === 0) {
    return null;
  }

  // Extract headers
  let headers: string[] = [];
  let dataStartIndex = 0;

  if (includeHeaders && rows[0]) {
    const headerRow = rows[0];
    headers = Array.from(headerRow.cells).map((cell, index) => {
      const text = cell.textContent?.trim() || '';
      return text || `Column${index + 1}`;
    });
    dataStartIndex = 1;
  } else {
    // Generate column names
    const firstRow = rows[0];
    headers = Array.from(firstRow.cells).map((_, index) => `Column${index + 1}`);
  }

  // Extract data rows
  const data: any[] = [];
  const rowsToProcess = maxRows ? rows.slice(dataStartIndex, dataStartIndex + maxRows) : rows.slice(dataStartIndex);

  for (const row of rowsToProcess) {
    const cells = Array.from(row.cells);
    
    // Skip empty rows if configured
    if (skipEmptyRows && cells.every(cell => !cell.textContent?.trim())) {
      continue;
    }

    const rowData: Record<string, any> = {};
    cells.forEach((cell, index) => {
      const columnName = headers[index] || `Column${index + 1}`;
      let value: any = cell.textContent?.trim() || '';
      
      // Try to parse numbers
      if (inferTypes && value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && value === numValue.toString()) {
          value = numValue;
        }
      }
      
      rowData[columnName] = value;
    });
    
    data.push(rowData);
  }

  // Infer schema
  const schema = inferTypes && data.length > 0
    ? inferSchema(data, 'Extracted Table')
    : createBasicSchema(headers, data.length);

  return {
    schema,
    data,
    source: 'dom',
    metadata: {
      selector,
      rowCount: data.length,
      columnCount: headers.length,
      extractedAt: new Date(),
    },
  };
}

/**
 * Normalize Vue data grid data
 */
export function normalizeVueData(
  data: any[],
  columns?: Array<{ field: string; header?: string; label?: string }>,
  options: TableExtractionOptions = {}
): ExtractedTable {
  const { maxRows, inferTypes = true } = options;

  // Limit rows if specified
  const processedData = maxRows ? data.slice(0, maxRows) : data;

  // Infer schema
  let schema: TableSchema;
  
  if (columns && columns.length > 0) {
    // Use provided column definitions
    schema = {
      name: 'Vue Data Grid',
      columns: columns.map(col => ({
        name: col.field,
        type: inferTypes && processedData.length > 0
          ? inferColumnType(processedData, col.field)
          : 'string',
        nullable: true,
      })),
      rowCount: processedData.length,
    };
  } else if (processedData.length > 0) {
    // Infer from data
    schema = inferSchema(processedData, 'Vue Data Grid');
  } else {
    schema = { name: 'Vue Data Grid', columns: [], rowCount: 0 };
  }

  return {
    schema,
    data: processedData,
    source: 'vue',
    metadata: {
      rowCount: processedData.length,
      columnCount: schema.columns.length,
      extractedAt: new Date(),
    },
  };
}

/**
 * Create basic schema from column names
 */
function createBasicSchema(columnNames: string[], rowCount: number = 0): TableSchema {
  return {
    name: 'Extracted Table',
    columns: columnNames.map(name => ({
      name,
      type: 'string',
      nullable: true,
    })),
    rowCount,
  };
}

