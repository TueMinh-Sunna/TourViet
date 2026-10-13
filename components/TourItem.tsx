import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDate, formatPrice, getSeatLabel } from '../utils/tour';

export type Tour = {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
};

export type TourItemProps = {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
};

function TourItem({ tour, compact = false, onPress, onToggleFavorite }: TourItemProps) {
  return (
    <View style={[styles.card, compact && styles.compact]}>
      <TouchableOpacity onPress={() => onPress(tour)} style={[styles.body, compact && styles.vertical]}>
        <Image source={{ uri: tour.image }} style={[styles.image, compact && styles.compactImage]} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={compact ? 1 : undefined}>{tour.name}</Text>
          {!compact && <>
            <Text>{tour.city}</Text>
            <Text>📅 {formatDate(tour.departure)} · {tour.days} ngày</Text>
          </>}
          <Text>{formatPrice(tour.price)}</Text>
          {!compact && <Text style={tour.seats <= 3 && styles.red}>{getSeatLabel(tour.seats)}</Text>}
        </View>
      </TouchableOpacity>
      <TouchableOpacity testID="fav-btn" accessibilityLabel="Yêu thích"
        style={[styles.heart, compact && styles.compactHeart]}
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}>
        <Text style={styles.heartText}>{tour.isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(TourItem);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  compact: { width: 160, flexDirection: 'column', marginBottom: 0 },
  body: { flex: 1, flexDirection: 'row', padding: 8, paddingRight: 42 },
  vertical: { flexDirection: 'column', padding: 0 },
  image: { width: 90, height: 90, borderRadius: 5 },
  compactImage: { width: '100%', height: undefined, aspectRatio: 4 / 3, borderRadius: 0 },
  info: { flex: 1, paddingLeft: 8 },
  name: { fontWeight: 'bold' },
  red: { color: 'red' },
  heart: { position: 'absolute', right: 8, top: 30, padding: 6, backgroundColor: '#fff', borderRadius: 20 },
  compactHeart: { top: 5, right: 5 },
  heartText: { fontSize: 20, color: 'red' },
});
