import SmartDataTable from './components/SmartDataTable.vue';
import { useSmartDataTable } from './composables/useSmartDataTable';
import { exportToCSV, exportToJSON, exportToExcel } from './utils/export';

export { SmartDataTable, useSmartDataTable, exportToCSV, exportToJSON, exportToExcel };

export type { Column, Action } from './components/SmartDataTable.vue';
export type { UseSmartDataTableOptions } from './composables/useSmartDataTable';

export default SmartDataTable;

