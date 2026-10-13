import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, RefreshControl, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../api';
import TourItem, { Tour } from '../components/TourItem';
import { formatDate, formatPrice, groupByCity } from '../utils/tour';

function show(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(title + '\n' + message);
  else Alert.alert(title, message);
}

export default function HomeScreen() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const favorites = tours.filter(tour => tour.isFavorite);
  const sections = useMemo(() => groupByCity(tours.filter(tour =>
    tour.name.toLowerCase().includes(search.trim().toLowerCase())
  )), [tours, search]);

  async function loadTours() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('GET ' + res.status);
      setTours(await res.json());
    } catch {
      show('Lỗi', 'Không tải được tour. Kiểm tra API_URL và kết nối mạng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  useEffect(() => { loadTours(); }, []);

  async function toggleFavorite(id: string, next: boolean) {
    setTours(prev => prev.map(tour => tour.id === id ? { ...tour, isFavorite: next } : tour));
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });
      if (!res.ok) throw new Error('PUT ' + res.status);
    } catch {
      setTours(prev => prev.map(tour => tour.id === id ? { ...tour, isFavorite: !next } : tour));
      show('Lỗi', 'Không cập nhật được yêu thích.');
    }
  }

  function openTour(tour: Tour) {
    show(tour.name, `Khởi hành: ${formatDate(tour.departure)}\n${tour.days} ngày\nGiá: ${formatPrice(tour.price)}`);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Tour Việt</Text>
        <Text>MSSV – Họ tên: ĐIỀN THÔNG TIN CỦA BẠN</Text>
        <TextInput style={styles.input} placeholder="Tìm tour theo tên..."
          value={search} onChangeText={setSearch} />
      </View>
      {loading ? <ActivityIndicator /> : <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => <Text style={styles.group}>
          {section.title} · {section.data.length} tour
        </Text>}
        renderItem={({ item }) => <TourItem tour={item} onPress={openTour} onToggleFavorite={toggleFavorite} />}
        ListHeaderComponent={<View style={styles.favorites}>
          <Text style={styles.group}>Tour yêu thích ({favorites.length})</Text>
          {favorites.length ? <FlatList horizontal showsHorizontalScrollIndicator={false}
            data={favorites} keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.gap} />}
            renderItem={({ item }) => <TourItem tour={item} compact onPress={openTour}
              onToggleFavorite={toggleFavorite} />}
          /> : <Text>Chưa có tour yêu thích</Text>}
        </View>}
        ListEmptyComponent={<Text>Không tìm thấy tour phù hợp</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          loadTours();
        }} />}
      />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: { paddingVertical: 10, gap: 8 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10 },
  group: { fontSize: 18, fontWeight: 'bold', backgroundColor: '#fff', paddingVertical: 8 },
  favorites: { paddingBottom: 10 },
  gap: { width: 10 },
});
