import React from 'react';
import { View, Text, FlatList } from 'react-native';

const items = [
  { id: '1', name: 'Public Item 1' },
  { id: '2', name: 'Public Item 2' },
  { id: '3', name: 'Public Item 3' },
];

const PublicScreen = () => (
  <View className="flex-1 bg-white p-4">
    <Text className="text-xl font-bold mb-4 text-primary">Public Items</Text>
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View className="border-b border-gray-200 py-2">
          <Text className="text-base">{item.name}</Text>
        </View>
      )}
    />
  </View>
);

export default PublicScreen;
