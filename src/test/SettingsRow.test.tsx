import { fireEvent, render } from '@testing-library/react-native';

import { SettingsRow } from '@/components/SettingsRow';

jest.mock('@/hooks/useLocale', () => ({
  useLocale: () => ({ locale: 'en', rtl: false }),
}));

describe('SettingsRow', () => {
  it('exposes the whole row as a labelled touch target', async () => {
    const onPress = jest.fn();
    const view = await render(
      <SettingsRow
        label="Privacy & memory"
        detail="Ask and Recovery remain separate"
        value="Local"
        onPress={onPress}
      />,
    );

    fireEvent.press(view.getByRole('button', { name: /Privacy & memory/ }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(view.getByText('Ask and Recovery remain separate')).toBeTruthy();
  });

  it('communicates selected and disabled state', async () => {
    const view = await render(<SettingsRow label="עברית" selected disabled />);
    const row = view.getByRole('button');
    expect(row.props.accessibilityState).toEqual({ disabled: true, selected: true });
    expect(view.getByText('עברית')).toBeTruthy();
  });
});
