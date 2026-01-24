/**
 * Multi-Table Analysis
 * Table joins, relationship detection, cross-table queries
 */

import type {
  TableRelationship,
  CrossTableAnalysis,
  DatabaseSchema,
  TableSchema
} from '../types';

/**
 * Join two tables
 */
export async function joinTables(
  options: {
    leftTable: any[];
    rightTable: any[];
    leftKey: string;
    rightKey: string;
    joinType: 'inner' | 'left' | 'right' | 'outer';
  }
): Promise<any[]> {
  const { leftTable, rightTable, leftKey, rightKey, joinType } = options;
  const result: any[] = [];

  // Create index for right table
  const rightIndex = new Map<any, any[]>();
  for (const rightRow of rightTable) {
    const key = rightRow[rightKey];
    if (!rightIndex.has(key)) {
      rightIndex.set(key, []);
    }
    rightIndex.get(key)!.push(rightRow);
  }

  // Perform join
  for (const leftRow of leftTable) {
    const key = leftRow[leftKey];
    const matches = rightIndex.get(key) || [];

    if (matches.length > 0) {
      for (const rightRow of matches) {
        result.push({ ...leftRow, ...rightRow });
      }
    } else if (joinType === 'left' || joinType === 'outer') {
      result.push({ ...leftRow });
    }
  }

  // Handle right/outer join
  if (joinType === 'right' || joinType === 'outer') {
    const leftKeys = new Set(leftTable.map(row => row[leftKey]));
    for (const rightRow of rightTable) {
      if (!leftKeys.has(rightRow[rightKey])) {
        result.push({ ...rightRow });
      }
    }
  }

  return result;
}

/**
 * Detect relationships between tables
 */
export async function detectRelationships(
  tables: Record<string, any[]>
): Promise<TableRelationship[]> {
  const relationships: TableRelationship[] = [];
  const tableNames = Object.keys(tables);

  for (let i = 0; i < tableNames.length; i++) {
    for (let j = i + 1; j < tableNames.length; j++) {
      const table1Name = tableNames[i];
      const table2Name = tableNames[j];
      const table1 = tables[table1Name];
      const table2 = tables[table2Name];

      const columns1 = Object.keys(table1[0] || {});
      const columns2 = Object.keys(table2[0] || {});

      // Check for potential foreign key relationships
      for (const col1 of columns1) {
        for (const col2 of columns2) {
          const relationship = analyzeColumnRelationship(
            table1, col1, table2, col2, table1Name, table2Name
          );
          if (relationship) {
            relationships.push(relationship);
          }
        }
      }
    }
  }

  return relationships;
}

/**
 * Analyze cross-table query
 */
export async function analyzeCrossTables(
  options: {
    tables: Record<string, any[]>;
    relationships: TableRelationship[];
    question: string;
  }
): Promise<CrossTableAnalysis> {
  const { tables, relationships, question } = options;

  // Simple cross-table analysis
  const tableNames = Object.keys(tables);
  const joinOperations = relationships.map(rel => ({
    left: rel.fromTable,
    right: rel.toTable,
    type: 'inner',
    on: `${rel.fromColumn} = ${rel.toColumn}`
  }));

  // Perform joins
  let result = tables[tableNames[0]];
  for (const rel of relationships) {
    if (tables[rel.toTable]) {
      result = await joinTables({
        leftTable: result,
        rightTable: tables[rel.toTable],
        leftKey: rel.fromColumn,
        rightKey: rel.toColumn,
        joinType: 'inner'
      });
    }
  }

  return {
    query: question,
    tables: tableNames,
    relationships,
    result: result.slice(0, 100), // Limit results
    insights: [
      `Joined ${tableNames.length} tables`,
      `Found ${result.length} matching records`
    ],
    joinOperations
  };
}

/**
 * Infer database schema
 */
export async function inferDatabaseSchema(
  tables: Record<string, any[]>
): Promise<DatabaseSchema> {
  const schemaTable = [];

  for (const [tableName, data] of Object.entries(tables)) {
    if (data.length === 0) continue;

    const columns = Object.keys(data[0]).map(colName => ({
      name: colName,
      type: detectColumnType(data.map(row => row[colName])),
      nullable: data.some(row => row[colName] === null || row[colName] === undefined)
    }));

    schemaTable.push({
      name: tableName,
      columns,
      rowCount: data.length
    });
  }

  const relationships = await detectRelationships(tables);

  return {
    tables: schemaTable,
    relationships
  };
}

// Helper functions
function analyzeColumnRelationship(
  table1: any[],
  col1: string,
  table2: any[],
  col2: string,
  table1Name: string,
  table2Name: string
): TableRelationship | null {
  const values1 = new Set(table1.map(row => row[col1]).filter(v => v !== null && v !== undefined));
  const values2 = new Set(table2.map(row => row[col2]).filter(v => v !== null && v !== undefined));

  // Check for overlap
  const intersection = new Set([...values1].filter(v => values2.has(v)));
  const matchingRows = intersection.size;

  if (matchingRows < Math.min(values1.size, values2.size) * 0.1) {
    return null; // Not enough overlap
  }

  const confidence = matchingRows / Math.min(values1.size, values2.size);

  // Determine relationship type
  let type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  if (values1.size === values2.size && matchingRows === values1.size) {
    type = 'one-to-one';
  } else if (values1.size < values2.size) {
    type = 'one-to-many';
  } else {
    type = 'many-to-many';
  }

  return {
    fromTable: table1Name,
    toTable: table2Name,
    fromColumn: col1,
    toColumn: col2,
    type,
    confidence,
    matchingRows,
    totalRows: table1.length
  };
}

function detectColumnType(values: any[]): 'string' | 'number' | 'boolean' | 'date' | 'categorical' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';

  const numericCount = nonNullValues.filter(v => !isNaN(Number(v))).length;
  if (numericCount / nonNullValues.length > 0.8) {
    return 'number';
  }

  return 'categorical';
}

