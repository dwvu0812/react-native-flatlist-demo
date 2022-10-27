import {View, Text, ListViewComponent} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {FlatList} from 'react-native';
import {Avatar, ListItem} from '@rneui/themed';
import {SearchBar} from '@rneui/themed';
// import { List, ListItem, SearchBar } from "react-native-elements";

const FlatListScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    makeRemoteRequest();
  }, [page]);

  const makeRemoteRequest = () => {
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    setLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(res => {
        page === 1
          ? setData(res.results)
          : setData(preData => [...preData, res.results]);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  //   console.log('data', data[0]);

  const handleRefresh = () => {
    setPage(1);
    setSeed(preSeed => preSeed + 1);
    makeRemoteRequest();
  };

  const handleLoadMore = () => {
    setPage(prePage => prePage + 1);
    makeRemoteRequest();
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  const renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <ListItem key={index}>
            <Avatar source={{uri: item?.picture?.thumbnail}} />
            <ListItem.Content>
              <ListItem.Title>{item?.name?.first}</ListItem.Title>
              <ListItem.Subtitle>{item?.name?.last}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        refreshing={loading}
        // onEndReached={handleLoadMore}
        onEndReachedThreshold={50}
      />
    </View>
  );
};

export default FlatListScreen;
