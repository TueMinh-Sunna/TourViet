import { readFile } from 'node:fs/promises';

const url = process.argv[2]?.replace(/\/$/, '');
if (!url || !/^https:\/\/[^/]+\.mockapi\.io\/.*\/tours$/.test(url)) {
  console.error('Cách dùng: node mockapi/seed.mjs https://<project>.mockapi.io/api/v1/tours');
  process.exit(1);
}
const existing = await fetch(url);
if (!existing.ok) throw new Error('GET lỗi: ' + existing.status);
const list = await existing.json();
if (!Array.isArray(list)) throw new Error('API không trả về mảng');
if (list.length) throw new Error('Resource đã có tour. Script dừng để không tạo trùng dữ liệu.');
const tours = JSON.parse(await readFile(new URL('./tours.json', import.meta.url), 'utf8'));
for (const [index, tour] of tours.entries()) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tour),
  });
  if (!res.ok) throw new Error(`POST tour ${index + 1} lỗi: ${res.status}`);
  console.log(`${index + 1}/12`, tour.name);
}
