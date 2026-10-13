import { formatDate, getSeatLabel, groupByCity } from '../utils/tour';
import type { Tour } from '../components/TourItem';

const base: Tour = {
  id: '1', name: 'Tour', city: 'Đà Lạt', days: 3, price: 3590000,
  seats: 5, departure: '2026-11-05', image: 'https://placehold.co/160x120', isFavorite: false,
};

test('nhóm theo thành phố A → Z và ngày tăng dần', () => {
  const groups = groupByCity([
    { ...base, id: '1', city: 'Đà Lạt', departure: '2026-11-10' },
    { ...base, id: '2', city: 'Hà Nội' },
    { ...base, id: '3', city: 'Đà Lạt', departure: '2026-11-05' },
  ]);
  expect(groups).toHaveLength(2);
  expect(groups.map(group => group.title)).toEqual(['Đà Lạt', 'Hà Nội']);
  expect(groups[0].data.map(tour => tour.id)).toEqual(['3', '1']);
});

test('định dạng ngày và các mức chỗ biên', () => {
  expect(formatDate('2026-11-05')).toBe('05/11/2026');
  expect(getSeatLabel(0)).toBe('Hết chỗ');
  expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
  expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
});
