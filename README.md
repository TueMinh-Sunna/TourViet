# Tour Việt — bài giải đề giữa kỳ

Project Expo tối giản bám sát 7 câu đề; chỉ có một màn hình. Dùng mockapi.io (GET, PUT), SectionList, FlatList ngang và 2 file test. Không dùng Mockaroo; chưa có API của bạn nên phải tạo resource để dữ liệu hiển thị và tim hoạt động.

## Mở trong VS Code

Giải nén, chọn File → Open Folder → thư mục TourViet. Mở Terminal → New Terminal (PowerShell). Máy cần Node.js và Internet để cài gói.

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
npx expo start
```

Trên web: `npx expo start --web`. Trên điện thoại: mở Expo Go và quét QR. Đã kèm package.json, app.json, index.ts, tsconfig.json, jest.config.js, toàn bộ source và tests. Script dùng `npx create-expo-app@latest TourViet --template blank-typescript` trong thư mục tạm để lấy bộ thư viện tương thích hiện hành, rồi cài gói cho code này. Chạy một lần. Project cũng có sẵn `package.json` Expo 54 cho trường hợp muốn chạy `npm install` thay vì script; nếu Expo Go trên máy báo không tương thích, chạy script để lấy SDK mới. Không cần tự chép code sang project khác.

## Tạo API

1. Vào https://mockapi.io, tạo project; tạo resource tên `tours`.
2. Tạo schema gồm `name` (string), `city` (string), `days` (number), `price` (number), `seats` (number), `departure` (string), `image` (string), `isFavorite` (boolean). `id` do mockapi.io tự cấp; để dạng string. Khi tạo resource, đặt số record sinh sẵn bằng 0 nếu có lựa chọn đó.
3. Mở `mockapi/tours.json`. Sửa `name` ở **bản ghi đầu tiên** thành có tên thật của bạn, chẳng hạn `Đà Lạt mộng mơ cùng Nguyễn Văn A`. Dữ liệu mẫu có 12 tour thuộc 4 thành phố, 2 tour hết chỗ, 2 tour còn 1–3 chỗ và 2 tour yêu thích.
4. Chép URL resource, ví dụ `https://abc.mockapi.io/api/v1/tours`; thay `API_URL` trong `api.ts` bằng URL của bạn. Không thêm dấu / cuối URL.
5. Nếu resource đang trống, trong Terminal chạy (thay URL mẫu):

```powershell
node mockapi/seed.mjs https://abc.mockapi.io/api/v1/tours
```

Script chỉ tạo dữ liệu nếu GET trả mảng trống; dừng khi đã có record, không tạo trùng. Nếu bạn đã tạo dữ liệu bằng giao diện web, bỏ qua script. Mở URL trên trình duyệt, đảm bảo trả về mảng 12 object, `id` là string và `isFavorite` là boolean. Nếu field cấu hình sai kiểu, sửa trong mockapi.io trước khi nhập lại dữ liệu.

6. Mở `screens/HomeScreen.tsx`, thay `ĐIỀN THÔNG TIN CỦA BẠN` bằng MSSV – họ tên thật. Lưu, chạy `npx expo start`.

## Test

```powershell
npm test
npm run typecheck
```

Test dùng dữ liệu giả nên không cần API. Nếu web không hiện Alert React Native, project dùng `window.alert` cho web. Khi nộp bài, chụp hình minh chứng từng câu, toàn màn hình có ngày giờ, đúng yêu cầu giảng viên.

## Đối chiếu đề

- Câu 1: SafeAreaProvider, SafeAreaView, header + ô tìm kiếm có state.
- Câu 2: GET, groupByCity, SectionList, sticky headers, loading.
- Câu 3–4: một TourItem cho hai bố cục; formatDate/getSeatLabel; danh sách yêu thích ngang.
- Câu 5: PUT, cập nhật ngay, hoàn tác và báo lỗi nếu thất bại.
- Câu 6: tìm kiếm useMemo, danh sách trống, kéo làm mới.
- Câu 7: `__tests__/tour.test.ts`, `__tests__/TourItem.test.tsx`.

Giới hạn: chưa thể chạy npm install, Expo hoặc Jest trong môi trường đóng gói vì truy cập npm registry bị chặn (HTTP 403). Chạy setup.ps1 và các lệnh kiểm tra trên máy có mạng.
