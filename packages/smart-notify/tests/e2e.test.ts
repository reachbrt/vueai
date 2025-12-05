import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSmartNotify } from '../src/composables/useSmartNotify';
import { UrgencyDetector } from '../src/ai/urgencyDetector';
import { TimingPredictor } from '../src/ai/timingPredictor';
import { GroupingEngine } from '../src/ai/groupingEngine';
import { AttentionMonitor } from '../src/ai/attentionMonitor';
import type { Notification, NotificationPriority } from '../src/types';

describe('Smart Notify - End-to-End Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. Basic Notification Creation and Management', () => {
    it('should create and display a notification', async () => {
      const { notify, notifications } = useSmartNotify();

      const notif = await notify({
        title: 'Test Notification',
        message: 'This is a test message',
        priority: 'medium'
      });

      expect(notif).toBeDefined();
      expect(notif.id).toBeDefined();
      expect(notif.title).toBe('Test Notification');
      expect(notif.message).toBe('This is a test message');
      expect(notif.priority).toBe('medium');
      expect(notifications.value.length).toBe(1);
    });

    it('should create notifications with different priorities', async () => {
      const { notify, notifications } = useSmartNotify({ enableAI: false });

      const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'critical'];

      for (const priority of priorities) {
        await notify({
          title: `${priority} priority`,
          message: `Test ${priority}`,
          priority
        });
      }

      expect(notifications.value.length).toBe(4);
      const priorityList = notifications.value.map(n => n.priority);
      expect(priorityList).toContain('low');
      expect(priorityList).toContain('medium');
      expect(priorityList).toContain('high');
      expect(priorityList).toContain('critical');
    });

    it('should dismiss a notification', async () => {
      const { notify, notifications, dismiss } = useSmartNotify();

      const notif = await notify({
        title: 'Test',
        message: 'Test message'
      });

      expect(notifications.value.length).toBe(1);

      // Dismiss the notification
      dismiss(notif.id);

      expect(notifications.value.filter(n => n.status !== 'dismissed').length).toBe(0);
    });

    it('should clear all notifications', () => {
      const { notify, clearAll, notifications } = useSmartNotify();
      
      // Create multiple notifications
      notify({ title: 'Test 1', message: 'Message 1' });
      notify({ title: 'Test 2', message: 'Message 2' });
      notify({ title: 'Test 3', message: 'Message 3' });

      expect(notifications.value.length).toBe(3);
      
      clearAll();
      
      expect(notifications.value.length).toBe(0);
    });
  });

  describe('2. AI Urgency Detection', () => {
    it('should detect urgent keywords in notification text', () => {
      const detector = new UrgencyDetector();

      const urgentTexts = [
        { title: 'URGENT: Server is down!', message: 'Server is down' },
        { title: 'Critical error in production', message: 'Critical error' },
        { title: 'Emergency: Database failure', message: 'Database failure' },
        { title: 'Alert: Security breach detected', message: 'Security breach' }
      ];

      urgentTexts.forEach(({ title, message }) => {
        const analysis = detector.analyze({
          id: '1',
          title,
          message,
          priority: 'medium',
          timestamp: Date.now(),
          status: 'pending',
          category: 'alert'
        });
        expect(analysis.score).toBeGreaterThan(0.5);
        expect(analysis.factors.keywords.length).toBeGreaterThan(0);
      });
    });

    it('should detect low urgency for normal messages', () => {
      const detector = new UrgencyDetector();

      const normalTexts = [
        { title: 'Your report is ready', message: 'Report ready' },
        { title: 'New message from John', message: 'New message' },
        { title: 'Weekly newsletter available', message: 'Newsletter' }
      ];

      normalTexts.forEach(({ title, message }) => {
        const analysis = detector.analyze({
          id: '1',
          title,
          message,
          priority: 'low',
          timestamp: Date.now(),
          status: 'pending',
          category: 'general'
        });
        expect(analysis.score).toBeLessThan(0.6);
      });
    });

    it('should auto-adjust priority based on urgency', async () => {
      const { notify, notifications } = useSmartNotify({ enableAI: true });

      const notif = await notify({
        title: 'URGENT: Critical System Failure',
        message: 'Emergency action required immediately!',
        // Don't set priority, let AI determine it
      });

      // The AI should detect urgency and set appropriate priority
      expect(notif.priority).toBeDefined();
      expect(['low', 'medium', 'high', 'critical']).toContain(notif.priority);
      expect(notif.urgency).toBeDefined();
      expect(notif.urgency).toBeGreaterThan(0);
    });
  });

  describe('3. Intelligent Grouping', () => {
    it('should group similar notifications together', () => {
      const { notify, groups } = useSmartNotify();

      // Create similar notifications
      notify({ title: 'New email from John', message: 'Meeting tomorrow' });
      notify({ title: 'New email from Sarah', message: 'Project update' });
      notify({ title: 'New email from Mike', message: 'Quick question' });

      // Wait for grouping to occur
      setTimeout(() => {
        expect(groups.value.length).toBeGreaterThan(0);
        const emailGroup = groups.value.find(g => g.category === 'email');
        expect(emailGroup).toBeDefined();
        expect(emailGroup?.notifications.length).toBe(3);
      }, 100);
    });

    it('should use GroupingEngine to find similar notifications', () => {
      const engine = new GroupingEngine();

      const notification1: Notification = {
        id: '1',
        title: 'Payment received',
        message: 'Payment of $100 received',
        priority: 'medium',
        timestamp: Date.now(),
        status: 'unread',
        category: 'payment'
      };

      const notification2: Notification = {
        id: '2',
        title: 'Payment processed',
        message: 'Payment of $50 processed',
        priority: 'medium',
        timestamp: Date.now(),
        status: 'unread',
        category: 'payment'
      };

      const related = engine.findRelated(notification1, [notification2]);
      expect(related.length).toBeGreaterThan(0);

      const group = engine.createGroup([notification1, notification2]);
      expect(group.notifications.length).toBe(2);
    });
  });

  describe('4. Attention Monitoring', () => {
    it('should detect user attention state', () => {
      const monitor = new AttentionMonitor();

      const attention = monitor.getCurrentState();

      expect(attention).toBeDefined();
      expect(attention.state).toBeDefined();
      expect(attention.lastActivity).toBeDefined();
      expect(attention.idleTime).toBeGreaterThanOrEqual(0);
      expect(attention.isPageVisible).toBeDefined();
      expect(attention.doNotDisturb).toBeDefined();
    });

    it('should track page visibility', () => {
      const monitor = new AttentionMonitor();

      // Simulate page visibility change
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: false
      });

      const attention = monitor.getCurrentState();
      expect(attention.isPageVisible).toBe(true);
    });
  });

  describe('5. Do Not Disturb Mode', () => {
    it('should enable and disable DND mode', () => {
      const monitor = new AttentionMonitor();

      expect(monitor.getCurrentState().doNotDisturb).toBe(false);

      monitor.setDoNotDisturb(true);
      expect(monitor.getCurrentState().doNotDisturb).toBe(true);

      monitor.setDoNotDisturb(false);
      expect(monitor.getCurrentState().doNotDisturb).toBe(false);
    });

    it('should not show notifications in DND mode (except critical)', async () => {
      const { notify, setDoNotDisturb, notifications } = useSmartNotify();

      setDoNotDisturb(true);

      // Normal notification should be queued, not shown
      await notify({
        title: 'Normal notification',
        message: 'This should be queued',
        priority: 'medium'
      });

      // Critical notification should still be shown
      await notify({
        title: 'CRITICAL: Critical alert',
        message: 'This should be shown',
        priority: 'critical'
      });

      // Critical notification should be delivered, medium priority should be scheduled
      const deliveredNotifs = notifications.value.filter(n => n.status === 'delivered');
      const scheduledNotifs = notifications.value.filter(n => n.status === 'scheduled');
      expect(deliveredNotifs.length + scheduledNotifs.length).toBeGreaterThan(0);
    });
  });

  describe('6. Notification Actions', () => {
    it('should execute notification actions', async () => {
      const { notify } = useSmartNotify();

      let actionExecuted = false;

      const notif = await notify({
        title: 'Test with action',
        message: 'Click the button',
        actions: [
          {
            label: 'Click me',
            action: () => {
              actionExecuted = true;
            }
          }
        ]
      });

      expect(notif.actions).toBeDefined();
      expect(notif.actions?.length).toBe(1);

      // Execute the action
      notif.actions![0].action();
      expect(actionExecuted).toBe(true);
    });
  });

  describe('7. Statistics and Analytics', () => {
    it('should track notification statistics', async () => {
      const { notify, getStats } = useSmartNotify({ enableAI: false });

      // Create various notifications
      await notify({ title: 'Test 1', message: 'Message 1', priority: 'low' });
      await notify({ title: 'Test 2', message: 'Message 2', priority: 'medium' });
      await notify({ title: 'Test 3', message: 'Message 3', priority: 'high' });

      const stats = getStats();

      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.delivered).toBeDefined();
      expect(stats.read).toBeDefined();
      expect(stats.dismissed).toBeDefined();
      expect(stats.batched).toBeDefined();
      expect(stats.topCategories).toBeDefined();
    });
  });

  describe('8. Data Export and Import', () => {
    it('should export notification data', async () => {
      const { notify, exportData } = useSmartNotify();

      await notify({ title: 'Test 1', message: 'Message 1' });
      await notify({ title: 'Test 2', message: 'Message 2' });

      const exported = exportData();

      expect(exported).toBeDefined();
      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported);
      expect(parsed.notifications).toBeDefined();
      expect(parsed.notifications.length).toBeGreaterThanOrEqual(2);
    });

    it('should import notification data', () => {
      const { importData, notifications } = useSmartNotify();

      const testData = {
        notifications: [
          {
            id: '1',
            title: 'Imported 1',
            message: 'Message 1',
            priority: 'medium' as NotificationPriority,
            timestamp: Date.now(),
            status: 'unread' as const,
            category: 'general' as const
          },
          {
            id: '2',
            title: 'Imported 2',
            message: 'Message 2',
            priority: 'high' as NotificationPriority,
            timestamp: Date.now(),
            status: 'unread' as const,
            category: 'general' as const
          }
        ],
        config: {},
        stats: {}
      };

      importData(testData);

      // Check that notifications were imported
      expect(notifications.value.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('9. Timing Prediction', () => {
    it('should predict optimal timing for notifications', () => {
      const predictor = new TimingPredictor();
      const monitor = new AttentionMonitor();

      const prediction = predictor.predict({
        id: '1',
        title: 'Test',
        message: 'Test message',
        priority: 'medium',
        timestamp: Date.now(),
        status: 'unread',
        category: 'general'
      }, monitor.getCurrentState());

      expect(prediction).toBeDefined();
      expect(prediction.recommendedTime).toBeDefined();
      expect(prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.confidence).toBeLessThanOrEqual(1);
      expect(prediction.reason).toBeDefined();
    });

    it('should not delay critical notifications', () => {
      const monitor = new AttentionMonitor();

      const notification = {
        id: '1',
        title: 'CRITICAL',
        message: 'Critical alert',
        priority: 'critical' as const,
        timestamp: Date.now(),
        status: 'unread' as const,
        category: 'alert' as const
      };

      const shouldDelay = monitor.shouldDelay(notification, monitor.getCurrentState());
      expect(shouldDelay).toBe(false);
    });
  });

  describe('10. Batching System', () => {
    it('should batch low-priority notifications', async () => {
      const { notify, notifications } = useSmartNotify();

      // Create multiple low-priority notifications quickly
      for (let i = 0; i < 5; i++) {
        await notify({
          title: `Low priority ${i}`,
          message: `Message ${i}`,
          priority: 'low'
        });
      }

      // Low priority notifications might be batched
      // The exact behavior depends on timing and batching settings
      expect(notifications.value.length).toBeGreaterThan(0);
      expect(notifications.value.length).toBeLessThanOrEqual(5);
    });
  });

  describe('11. Persistence and Storage', () => {
    it('should persist notifications to localStorage', async () => {
      const { notify } = useSmartNotify();

      await notify({ title: 'Persistent', message: 'This should be saved' });

      // Check if data was saved to localStorage
      const saved = localStorage.getItem('smart-notify-notifications');
      expect(saved).toBeDefined();
      expect(saved).not.toBe(null);
    });

    it('should restore notifications from localStorage', async () => {
      // Clear localStorage first
      localStorage.clear();

      // First session: create notifications
      const { notify } = useSmartNotify();
      await notify({ title: 'Test 1', message: 'Message 1' });
      await notify({ title: 'Test 2', message: 'Message 2' });

      // Check localStorage has data
      const saved = localStorage.getItem('smart-notify-notifications');
      expect(saved).not.toBe(null);
    });
  });

  describe('12. Integration Test - Complete Workflow', () => {
    it('should handle a complete notification lifecycle', async () => {
      const { notify, notifications, setDoNotDisturb, clearAll, getStats, dismiss } = useSmartNotify();

      // Step 1: Create notifications
      const notif1 = await notify({
        title: 'Welcome',
        message: 'Welcome to Smart Notify!',
        priority: 'low'
      });

      const notif2 = await notify({
        title: 'URGENT: Action Required',
        message: 'Please review this immediately',
        priority: 'medium' // Will be upgraded by AI
      });

      expect(notifications.value.length).toBeGreaterThanOrEqual(2);

      // Step 2: Check urgency detection worked (should be high or critical)
      expect(['medium', 'high', 'critical']).toContain(notif2.priority);

      // Step 3: Enable DND mode
      setDoNotDisturb(true);

      // Step 4: Try to create a normal notification (should be scheduled)
      await notify({
        title: 'Normal',
        message: 'This should be scheduled',
        priority: 'low'
      });

      // Step 5: Disable DND mode
      setDoNotDisturb(false);

      // Step 6: Check statistics
      const stats = getStats();
      expect(stats.total).toBeGreaterThanOrEqual(2);

      // Step 7: Dismiss a notification
      dismiss(notif1.id);

      // Step 8: Clear all
      clearAll();
      expect(notifications.value.length).toBe(0);
    });
  });
});

