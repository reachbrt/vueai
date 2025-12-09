/**
 * Sample datasets for AI-native SmartDataTable demo
 */

export interface SalesOrder {
  id: string;
  orderDate: string;
  customer: string;
  country: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
}

export interface SupportTicket {
  id: string;
  createdAt: string;
  customer: string;
  email: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  responseTime: number; // hours
  resolutionTime?: number; // hours
}

export const salesOrders: SalesOrder[] = [
  { id: 'ORD-001', orderDate: '2025-11-15', customer: 'Acme Corp', country: 'USA', product: 'Laptop Pro', quantity: 5, unitPrice: 1200, total: 6000, status: 'delivered', paymentMethod: 'Credit Card' },
  { id: 'ORD-002', orderDate: '2025-11-18', customer: 'Tech Solutions', country: 'India', product: 'Wireless Mouse', quantity: 50, unitPrice: 25, total: 1250, status: 'shipped', paymentMethod: 'PayPal' },
  { id: 'ORD-003', orderDate: '2025-11-20', customer: 'Global Enterprises', country: 'UK', product: 'Monitor 4K', quantity: 10, unitPrice: 450, total: 4500, status: 'delivered', paymentMethod: 'Bank Transfer' },
  { id: 'ORD-004', orderDate: '2025-11-22', customer: 'StartUp Inc', country: 'USA', product: 'Keyboard Mechanical', quantity: 15, unitPrice: 120, total: 1800, status: 'pending', paymentMethod: 'Credit Card' },
  { id: 'ORD-005', orderDate: '2025-11-25', customer: 'Digital Agency', country: 'Canada', product: 'Laptop Pro', quantity: 3, unitPrice: 1200, total: 3600, status: 'shipped', paymentMethod: 'Credit Card' },
  { id: 'ORD-006', orderDate: '2025-11-28', customer: 'Innovate Ltd', country: 'India', product: 'Webcam HD', quantity: 20, unitPrice: 80, total: 1600, status: 'delivered', paymentMethod: 'PayPal' },
  { id: 'ORD-007', orderDate: '2025-12-01', customer: 'Tech Hub', country: 'Germany', product: 'Headphones Pro', quantity: 25, unitPrice: 150, total: 3750, status: 'shipped', paymentMethod: 'Credit Card' },
  { id: 'ORD-008', orderDate: '2025-12-03', customer: 'Cloud Systems', country: 'USA', product: 'Monitor 4K', quantity: 8, unitPrice: 450, total: 3600, status: 'pending', paymentMethod: 'Bank Transfer' },
  { id: 'ORD-009', orderDate: '2025-12-05', customer: 'Data Corp', country: 'India', product: 'SSD 1TB', quantity: 100, unitPrice: 90, total: 9000, status: 'delivered', paymentMethod: 'Credit Card' },
  { id: 'ORD-010', orderDate: '2025-12-06', customer: 'Web Solutions', country: 'Australia', product: 'Laptop Pro', quantity: 2, unitPrice: 1200, total: 2400, status: 'pending', paymentMethod: 'PayPal' },
  { id: 'ORD-011', orderDate: '2025-12-07', customer: 'Mobile First', country: 'UK', product: 'Wireless Mouse', quantity: 30, unitPrice: 25, total: 750, status: 'shipped', paymentMethod: 'Credit Card' },
  { id: 'ORD-012', orderDate: '2025-11-10', customer: 'Enterprise Co', country: 'USA', product: 'Docking Station', quantity: 12, unitPrice: 200, total: 2400, status: 'delivered', paymentMethod: 'Bank Transfer' },
  { id: 'ORD-013', orderDate: '2025-11-12', customer: 'Smart Tech', country: 'India', product: 'USB Hub', quantity: 40, unitPrice: 35, total: 1400, status: 'delivered', paymentMethod: 'PayPal' },
  { id: 'ORD-014', orderDate: '2025-11-14', customer: 'Future Systems', country: 'Canada', product: 'Monitor 4K', quantity: 6, unitPrice: 450, total: 2700, status: 'cancelled', paymentMethod: 'Credit Card' },
  { id: 'ORD-015', orderDate: '2025-11-16', customer: 'Digital World', country: 'Germany', product: 'Laptop Pro', quantity: 4, unitPrice: 1200, total: 4800, status: 'delivered', paymentMethod: 'Credit Card' },
  { id: 'ORD-016', orderDate: '2025-11-19', customer: 'Code Factory', country: 'USA', product: 'Keyboard Mechanical', quantity: 20, unitPrice: 120, total: 2400, status: 'shipped', paymentMethod: 'PayPal' },
  { id: 'ORD-017', orderDate: '2025-11-21', customer: 'AI Labs', country: 'India', product: 'Graphics Card', quantity: 5, unitPrice: 800, total: 4000, status: 'delivered', paymentMethod: 'Bank Transfer' },
  { id: 'ORD-018', orderDate: '2025-11-23', customer: 'Cloud Nine', country: 'UK', product: 'RAM 32GB', quantity: 15, unitPrice: 180, total: 2700, status: 'shipped', paymentMethod: 'Credit Card' },
  { id: 'ORD-019', orderDate: '2025-11-26', customer: 'Dev Studio', country: 'Australia', product: 'SSD 1TB', quantity: 30, unitPrice: 90, total: 2700, status: 'delivered', paymentMethod: 'PayPal' },
  { id: 'ORD-020', orderDate: '2025-11-29', customer: 'Tech Innovators', country: 'USA', product: 'Laptop Pro', quantity: 7, unitPrice: 1200, total: 8400, status: 'pending', paymentMethod: 'Credit Card' },
];

export const supportTickets: SupportTicket[] = [
  { id: 'TKT-001', createdAt: '2025-12-01 09:00', customer: 'John Doe', email: 'john@example.com', subject: 'Login issues', category: 'Technical', priority: 'high', status: 'resolved', assignedTo: 'Sarah', responseTime: 2, resolutionTime: 4 },
  { id: 'TKT-002', createdAt: '2025-12-01 10:30', customer: 'Jane Smith', email: 'jane@example.com', subject: 'Billing question', category: 'Billing', priority: 'medium', status: 'closed', assignedTo: 'Mike', responseTime: 1, resolutionTime: 3 },
  { id: 'TKT-003', createdAt: '2025-12-02 11:15', customer: 'Bob Johnson', email: 'bob@example.com', subject: 'Feature request', category: 'Feature', priority: 'low', status: 'open', assignedTo: 'Sarah', responseTime: 24, resolutionTime: undefined },
  { id: 'TKT-004', createdAt: '2025-12-02 14:20', customer: 'Alice Brown', email: 'alice@example.com', subject: 'Data export not working', category: 'Technical', priority: 'urgent', status: 'in-progress', assignedTo: 'Tom', responseTime: 0.5, resolutionTime: undefined },
  { id: 'TKT-005', createdAt: '2025-12-03 08:45', customer: 'Charlie Wilson', email: 'charlie@example.com', subject: 'Account upgrade', category: 'Sales', priority: 'medium', status: 'resolved', assignedTo: 'Lisa', responseTime: 3, resolutionTime: 6 },
  { id: 'TKT-006', createdAt: '2025-12-03 13:00', customer: 'Diana Lee', email: 'diana@example.com', subject: 'Password reset', category: 'Technical', priority: 'high', status: 'resolved', assignedTo: 'Sarah', responseTime: 1, resolutionTime: 2 },
  { id: 'TKT-007', createdAt: '2025-12-04 09:30', customer: 'Eve Martinez', email: 'eve@example.com', subject: 'Integration help', category: 'Technical', priority: 'medium', status: 'in-progress', assignedTo: 'Tom', responseTime: 4, resolutionTime: undefined },
  { id: 'TKT-008', createdAt: '2025-12-04 15:45', customer: 'Frank Garcia', email: 'frank@example.com', subject: 'Refund request', category: 'Billing', priority: 'high', status: 'open', assignedTo: 'Mike', responseTime: 12, resolutionTime: undefined },
  { id: 'TKT-009', createdAt: '2025-12-05 10:00', customer: 'Grace Taylor', email: 'grace@example.com', subject: 'API documentation', category: 'Documentation', priority: 'low', status: 'closed', assignedTo: 'Lisa', responseTime: 8, resolutionTime: 24 },
  { id: 'TKT-010', createdAt: '2025-12-05 16:20', customer: 'Henry Anderson', email: 'henry@example.com', subject: 'Performance issues', category: 'Technical', priority: 'urgent', status: 'in-progress', assignedTo: 'Tom', responseTime: 1, resolutionTime: undefined },
  { id: 'TKT-011', createdAt: '2025-12-06 08:00', customer: 'Ivy Thomas', email: 'ivy@example.com', subject: 'Mobile app crash', category: 'Technical', priority: 'urgent', status: 'open', assignedTo: 'Sarah', responseTime: 2, resolutionTime: undefined },
  { id: 'TKT-012', createdAt: '2025-12-06 11:30', customer: 'Jack White', email: 'jack@example.com', subject: 'Pricing inquiry', category: 'Sales', priority: 'low', status: 'resolved', assignedTo: 'Lisa', responseTime: 5, resolutionTime: 8 },
  { id: 'TKT-013', createdAt: '2025-12-06 14:00', customer: 'Kelly Harris', email: 'kelly@example.com', subject: 'Data migration', category: 'Technical', priority: 'high', status: 'in-progress', assignedTo: 'Tom', responseTime: 3, resolutionTime: undefined },
  { id: 'TKT-014', createdAt: '2025-12-07 09:15', customer: 'Leo Clark', email: 'leo@example.com', subject: 'Training request', category: 'Support', priority: 'medium', status: 'open', assignedTo: 'Mike', responseTime: 6, resolutionTime: undefined },
  { id: 'TKT-015', createdAt: '2025-12-07 12:45', customer: 'Mia Lewis', email: 'mia@example.com', subject: 'Security concern', category: 'Security', priority: 'urgent', status: 'in-progress', assignedTo: 'Sarah', responseTime: 0.5, resolutionTime: undefined },
];

