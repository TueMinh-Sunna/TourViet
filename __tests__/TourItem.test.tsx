import { fireEvent, render } from '@testing-library/react-native';
import TourItem, { Tour } from '../components/TourItem';

const tour: Tour = {
  id: '1', name: 'Đà Lạt mộng mơ', city: 'Đà Lạt', days: 3, price: 3590000,
  seats: 3, departure: '2026-11-05', image: 'https://placehold.co/160x120', isFavorite: false,
};

test('compact ẩn thành phố, dạng thường hiện thành phố', async () => {
  const props = { tour, onPress: jest.fn(), onToggleFavorite: jest.fn() };
  const view = await render(<TourItem {...props} compact />);
  expect(view.queryByText('Đà Lạt')).toBeNull();
  view.rerender(<TourItem {...props} />);
  expect(view.getByText('Đà Lạt')).toBeTruthy();
});

test('tim không mở tour; nhấn tên mở đúng tour', async () => {
  const onPress = jest.fn();
  const onToggleFavorite = jest.fn();
  const view = await render(<TourItem tour={tour} onPress={onPress}
    onToggleFavorite={onToggleFavorite} />);
  await fireEvent.press(view.getByTestId('fav-btn'));
  expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  expect(onToggleFavorite).toHaveBeenCalledWith('1', true);
  expect(onPress).not.toHaveBeenCalled();
  await fireEvent.press(view.getByText(tour.name));
  expect(onPress).toHaveBeenCalledWith(tour);
});
