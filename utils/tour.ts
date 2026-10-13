import type { Tour } from '../components/TourItem';

export function groupByCity(tours: Tour[]) {
  const cities = [...new Set(tours.map(tour => tour.city))].sort((a, b) => a.localeCompare(b, 'vi'));
  return cities.map(title => ({
    title,
    data: tours.filter(tour => tour.city === title)
      .sort((a, b) => a.departure.localeCompare(b.departure)),
  }));
}

export function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export function getSeatLabel(seats: number) {
  if (seats === 0) return 'Hết chỗ';
  if (seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}
