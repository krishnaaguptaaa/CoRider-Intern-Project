import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const Index = () => {
  const [show, setShow] = useState(false);
  const [btnOptions, setBtnOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchChats(0);
  }, []);

  const fetchChats = async (newPage) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`https://qa.corider.in/assignment/chat?page=${newPage}`);
      const data = await response.json();

      if (newPage === 0) {
        setChats(data);
      } else {
        setChats((prev) => ({
          ...prev,
          chats: [...prev.chats, ...data.chats],
        }));
        if (data.chats.length === 0) {
          setHasMore(false);
        }
      }
      setPage(newPage);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !chats) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <View style={styles.sub}>
          <TouchableOpacity>
            <Feather name="arrow-left" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{chats?.name}</Text>
        </View>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tripContainer}>
        <View style={styles.tripLeft}>
          <Image
            style={styles.avatar}
            source={require('./../assets/images/grpImg.png')}
          />
          <View style={styles.locationText}>
            <Text style={styles.fromText}>
              From <Text style={styles.bold}>{chats?.from}</Text>
            </Text>
            <Text style={styles.fromText}>
              To <Text style={styles.bold}>{chats?.to}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShow(!show)}>
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>

        {show && (
          <View style={styles.optionBox}>
            <TouchableOpacity style={styles.item}>
              <Feather name="users" size={18} color="black" />
              <Text style={styles.text}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Feather name="phone" size={18} color="black" />
              <Text style={styles.text}>Share Number</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Feather name="message-square" size={18} color="black" />
              <Text style={styles.text}>Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={chats?.chats || []}
        inverted
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={() => fetchChats(page + 1)}
        onEndReachedThreshold={0.3}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: item.sender.self ? "row-reverse" : "row",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            {!item.sender.self && (
              <Image
                source={{ uri: item.sender.image }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginHorizontal: 8,
                  marginTop: 4,
                }}
              />
            )}
            <View
              style={{
                backgroundColor: item.sender.self ? "#3777f0" : "#fff",
                padding: 12,
                borderRadius: 12,
                maxWidth: "75%",
              }}
            >
              <Text
                style={{
                  color: item.sender.self ? "#fff" : "#000",
                  fontFamily: "inter-medium",
                }}
              >
                {item.message}
              </Text>
            </View>
          </View>
        )}
      />


            
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => setBtnOptions(!btnOptions)}
          style={styles.iconButton}
        >
          <Feather name="paperclip" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="send" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {btnOptions && (
        <View style={styles.btnBox}>
          <TouchableOpacity style={styles.btniItem}>
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btniItem}>
            <Feather name="video" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btniItem}>
            <MaterialCommunityIcons
              name="file-download-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '10%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'inter-bold',
    fontSize: 28,
    marginLeft: 12,
  },
  tripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  tripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  locationText: {
    flexDirection: 'column',
  },
  fromText: {
    fontFamily: 'inter-medium',
    fontSize: 22,
    color: '#444',
  },
  bold: {
    fontFamily: 'inter-semibold',
    color: '#000',
  },
  optionBox: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowRadius: 4,
    elevation: 5,
    width: 180,
    zIndex: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    color: '#111',
    fontFamily: 'inter-medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 12,
    borderRadius: 10,
    marginBottom: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'inter-regular',
    color: '#000',
  },
  iconButton: {
    marginLeft: 12,
  },
  btnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    position: 'absolute',
    bottom: 100,
    right: 30,
    zIndex: 20,
  },
  btniItem: {
    padding: 10,
  },
});
