import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import {
  buildGentleReturnPlan,
  cancelGentleReturnNotifications,
  scheduleGentleReturnNotification,
} from '@/utils/notifications';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  AndroidImportance: { DEFAULT: 3 },
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
  SchedulableTriggerInputTypes: { DAILY: 'daily', WEEKLY: 'weekly' },
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
}));

const getItem = jest.mocked(AsyncStorage.getItem);
const setItem = jest.mocked(AsyncStorage.setItem);
const removeItem = jest.mocked(AsyncStorage.removeItem);
const getPermissions = jest.mocked(Notifications.getPermissionsAsync);
const requestPermissions = jest.mocked(Notifications.requestPermissionsAsync);
const getScheduled = jest.mocked(Notifications.getAllScheduledNotificationsAsync);
const schedule = jest.mocked(Notifications.scheduleNotificationAsync);
const cancel = jest.mocked(Notifications.cancelScheduledNotificationAsync);

function permission(status: Notifications.PermissionStatus): Notifications.NotificationPermissionsStatus {
  return {
    status,
    granted: status === Notifications.PermissionStatus.GRANTED,
    canAskAgain: status !== Notifications.PermissionStatus.DENIED,
    expires: 'never',
  } as Notifications.NotificationPermissionsStatus;
}

describe('gentle return notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getItem.mockResolvedValue(null);
    setItem.mockResolvedValue(undefined);
    removeItem.mockResolvedValue(undefined);
    getScheduled.mockResolvedValue([]);
    getPermissions.mockResolvedValue(permission(Notifications.PermissionStatus.GRANTED));
    requestPermissions.mockResolvedValue(permission(Notifications.PermissionStatus.GRANTED));
    schedule.mockResolvedValue('new-schedule');
    cancel.mockResolvedValue(undefined);
  });

  it('builds a daily plan and clamps an invalid hour', () => {
    const plan = buildGentleReturnPlan('morning', 90, 'en');
    expect(plan.hour).toBe(23);
    expect(plan.trigger).toMatchObject({ type: 'daily', hour: 23, minute: 0 });
    expect(plan.body).toContain('full check-in');
  });

  it('uses a weekly Friday trigger before the weekend', () => {
    const plan = buildGentleReturnPlan('before_weekend', 17, 'he');
    expect(plan.trigger).toMatchObject({ type: 'weekly', weekday: 6, hour: 17 });
    expect(plan.body).toContain('סוף השבוע');
  });

  it('does not schedule when permission is denied', async () => {
    getPermissions.mockResolvedValue(permission(Notifications.PermissionStatus.DENIED));
    requestPermissions.mockResolvedValue(permission(Notifications.PermissionStatus.DENIED));

    await expect(scheduleGentleReturnNotification('evening', 20, 'en')).resolves.toEqual({ status: 'denied' });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('replaces only Flow Hijacked gentle-return schedules', async () => {
    getItem.mockResolvedValue(JSON.stringify(['old-owned']));
    getScheduled.mockResolvedValue([
      {
        identifier: 'discovered-owned',
        content: { title: null, subtitle: null, body: null, data: { owner: 'flow-hijacked-gentle-return' }, sound: null },
        trigger: { type: 'unknown' },
      },
      {
        identifier: 'unrelated',
        content: { title: null, subtitle: null, body: null, data: { owner: 'another-feature' }, sound: null },
        trigger: { type: 'unknown' },
      },
    ] as unknown as Notifications.NotificationRequest[]);

    await expect(scheduleGentleReturnNotification('evening', 20, 'en')).resolves.toEqual({
      status: 'scheduled',
      identifier: 'new-schedule',
    });
    expect(cancel).toHaveBeenCalledWith('old-owned');
    expect(cancel).toHaveBeenCalledWith('discovered-owned');
    expect(cancel).not.toHaveBeenCalledWith('unrelated');
    expect(setItem).toHaveBeenCalledWith(expect.any(String), JSON.stringify(['new-schedule']));
  });

  it('cancels owned schedules without cancelling unrelated notifications', async () => {
    getScheduled.mockResolvedValue([
      {
        identifier: 'owned',
        content: { title: null, subtitle: null, body: null, data: { owner: 'flow-hijacked-gentle-return' }, sound: null },
        trigger: { type: 'unknown' },
      },
      {
        identifier: 'other',
        content: { title: null, subtitle: null, body: null, data: {}, sound: null },
        trigger: { type: 'unknown' },
      },
    ] as unknown as Notifications.NotificationRequest[]);

    await cancelGentleReturnNotifications();
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledWith('owned');
    expect(removeItem).toHaveBeenCalled();
  });
});
