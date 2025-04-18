import { ExpoWatchConnectivityManagerView } from 'expo-watch-connectivity-manager';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useMotionDataTracker } from './hooks/useMotionDataTracker';

export default function App() {
  const {
    tracking,
    trackingStartedAt,
    trackingCompletedAt,
    trackingData,
    connectedWatch,
    isReachable,
    checkWCReachability,
    startTracking,
    stopTracking,
  } = useMotionDataTracker();

  const onPress = useCallback(async () => {
    if (tracking) {
      await stopTracking();
      return;
    }

    await startTracking();
  }, [tracking, startTracking, stopTracking]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Watch Connectivity Module Usecase Example</Text>
        <Group name="Connected Watch">
          <Text>{connectedWatch}</Text>
        </Group>
        <Group name="Phone Reachable?">
          <Text onPress={checkWCReachability}>{isReachable ? 'Yes' : 'No'}</Text>
        </Group>
        <Group name="Track Motions">
          <View style={styles.row}>
            {tracking && <ActivityIndicator />}
            <Button title={tracking ? 'Stop Tracking' : 'Start Tracking'} onPress={onPress} />
          </View>
        </Group>
        {trackingStartedAt && (
          <Group name="Tracking Started At">
            <Text>{trackingStartedAt.toISOString()}</Text>
          </Group>
        )}
        {trackingCompletedAt && (
          <Group name="Tracking Completed At">
            <Text>{trackingCompletedAt.toISOString()}</Text>
          </Group>
        )}

        <Group name="Tracked Data">
          {trackingData.length === 0 ? (
            <Text>Empty.</Text>
          ) : (
            trackingData.map((d) => (
              <Group key={d.timestamp} name="User Acceleration">
                <View style={styles.row}>
                  <Text>X: {d.userAcceleration.x}</Text>
                  <Text>Y: {d.userAcceleration.y}</Text>
                  <Text>Z: {d.userAcceleration.z}</Text>
                </View>
              </Group>
            ))
          )}
        </Group>

        <Group name="Views">
          <ExpoWatchConnectivityManagerView
            url="https://www.example.com"
            onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
            style={styles.view}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
  row: {
    gap: 8,
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
