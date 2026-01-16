// src/screens/HomeScreen.js
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../App';
import { apiGet } from '../api/client';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    myListings: 0,
    unread: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const name = user?.full_name || 'there';
  const type = user?.user_type || 'user';
  const isBuyer = type === 'buyer';
  const isFisherman = type === 'fisherman';

  useEffect(() => {
    const load = async () => {
      try {
        const all = await apiGet('getlistings');
        const mine = isBuyer ? await apiGet('getmylistings') : [];
        setStats({
          totalListings: Array.isArray(all) ? all.length : 0,
          myListings: Array.isArray(mine) ? mine.length : 0,
          unread: 0,
        });
      } catch {
        setStats({ totalListings: 0, myListings: 0, unread: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, [isBuyer]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hi {name}</Text>
            <Text style={styles.subtitleText}>
              {isBuyer ? 'Buyer' : isFisherman ? 'Fisherman' : 'User'} · AquaTrade
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {name ? name[0].toUpperCase() : 'A'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Today on Aqua Trade</Text>
          <Text style={styles.heroTitle}>
            {isBuyer ? 'Find fresh catch faster' : 'Turn your catch into cash'}
          </Text>
          <Text style={styles.heroText}>
            {isBuyer
              ? 'Post what you want to buy and let trusted fishermen reach out.'
              : 'Browse buyer requests, message them, and agree on price and delivery.'}
          </Text>

          <View style={styles.heroChipsRow}>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>⚓ Coastal trading</Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipText}>🐟 Direct to buyer</Text>
            </View>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>How Aqua Trade works</Text>
          <Text style={styles.sectionHeaderTag}>Quick guide</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBubble}>
              <Text style={styles.infoIcon}>1</Text>
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoStepTitle}>Buyer posts a request</Text>
              <Text style={styles.infoStepText}>
                Set species, quantity, target price, and city so fishermen know what you need.
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBubble}>
              <Text style={styles.infoIcon}>2</Text>
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoStepTitle}>Fisherman reaches out</Text>
              <Text style={styles.infoStepText}>
                Fishermen browse listings, message buyers, and agree on a meeting place and time.
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBubble}>
              <Text style={styles.infoIcon}>3</Text>
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoStepTitle}>Order and meetup</Text>
              <Text style={styles.infoStepText}>
                Fisherman creates an order, then you meet, check the catch, and finalize payment.
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBubble}>
              <Text style={styles.infoIcon}>4</Text>
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoStepTitle}>Rate and build trust</Text>
              <Text style={styles.infoStepText}>
                Buyer marks the order completed and both sides leave ratings to help others.
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Live listings</Text>
            {loadingStats ? (
              <ActivityIndicator size="small" color="#0E8A8B" />
            ) : (
              <Text style={styles.statValue}>{stats.totalListings}</Text>
            )}
            <Text style={styles.statHint}>What buyers need today</Text>
          </View>

          {isBuyer ? (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>My listings</Text>
              {loadingStats ? (
                <ActivityIndicator size="small" color="#0E8A8B" />
              ) : (
                <Text style={styles.statValue}>{stats.myListings}</Text>
              )}
              <Text style={styles.statHint}>Your active requests</Text>
            </View>
          ) : (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Unread chats</Text>
              {loadingStats ? (
                <ActivityIndicator size="small" color="#0E8A8B" />
              ) : (
                <Text style={styles.statValue}>{stats.unread}</Text>
              )}
              <Text style={styles.statHint}>Follow up on deals</Text>
            </View>
          )}
        </View>

        {/* Next steps */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Next steps</Text>

          {isBuyer ? (
            <>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate('NewRequest')}
              >
                <View style={styles.actionIconBubble}>
                  <Text style={styles.actionIconText}>＋</Text>
                </View>
                <View style={styles.actionTextBlock}>
                  <Text style={styles.actionTitle}>Post what you want to buy</Text>
                  <Text style={styles.actionSubtitle}>
                    Create a request so nearby fishermen can offer their catch.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate('MyListings')}
              >
                <View style={styles.actionIconBubble}>
                  <Text style={styles.actionIconText}>📋</Text>
                </View>
                <View style={styles.actionTextBlock}>
                  <Text style={styles.actionTitle}>Review my listings</Text>
                  <Text style={styles.actionSubtitle}>
                    Edit or cancel requests you no longer need.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => navigation.navigate('Transactions')}
              >
                <Text
                  style={{
                    color: '#0E8A8B',
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  View transactions
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate('Listings')}
              >
                <View style={styles.actionIconBubble}>
                  <Text style={styles.actionIconText}>🐟</Text>
                </View>
                <View style={styles.actionTextBlock}>
                  <Text style={styles.actionTitle}>Browse buyer listings</Text>
                  <Text style={styles.actionSubtitle}>
                    Find requests that match today&apos;s catch and start a chat.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => navigation.navigate('Transactions')}
              >
                <Text
                  style={{
                    color: '#0E8A8B',
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  View transactions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => navigation.navigate('Messages')}
              >
                <View style={styles.actionIconBubble}>
                  <Text style={styles.actionIconText}>💬</Text>
                </View>
                <View style={styles.actionTextBlock}>
                  <Text style={styles.actionTitle}>Reply to chats</Text>
                  <Text style={styles.actionSubtitle}>
                    Confirm quantity, price, and meeting point with buyers.
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Tips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tips for safe trading</Text>
          <Text style={styles.tipText}>• Meet in public or known ports.</Text>
          <Text style={styles.tipText}>
            • Confirm price and weight before pickup.
          </Text>
          <Text style={styles.tipText}>
            • Agree on payment method in chat before the meetup.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  container: { padding: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  subtitleText: {
    marginTop: 2,
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  heroCard: {
    backgroundColor: '#0E8A8B',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  heroLabel: {
    fontSize: 11,
    color: '#bae6fd',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  heroTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  heroText: {
    color: '#e0f2fe',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  heroChipsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  heroChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#022c22',
  },
  heroChipText: {
    color: '#a7f3d0',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeaderTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionHeaderTag: {
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  infoCard: {
    backgroundColor: '#020617',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoIconBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoIcon: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  infoTextBlock: {
    flex: 1,
  },
  infoStepTitle: {
    color: '#e5e7eb',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  infoStepText: {
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 12,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  statValue: {
    color: '#e5e7eb',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  statHint: {
    marginTop: 4,
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  sectionCard: {
    backgroundColor: '#020617',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionIconText: {
    color: '#ffffff',
    fontSize: 16,
  },
  actionTextBlock: {
    flex: 1,
  },
  actionTitle: {
    color: '#e5e7eb',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  actionSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  tipText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
});
