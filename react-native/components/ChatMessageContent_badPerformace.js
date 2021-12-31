import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  ScrollView,
  View,
  Text,
  SectionList,
  Animated,
  Pressable,
} from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import createStyles from "../styles/styles";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import ChatMessageHeaderUserInfo from "./ChatMessageHeaderUserInfo";
import UserIconImage from "./UserIconImage";
import TimeAgo from "./TimeAgo";
import DateShort from "./DateShort";

const DateSectionContext = createContext();
const UserSectionContext = createContext();
const StatusSectionContext = createContext();

const ChatBubbleView = (props) => {
  if (props.cellKey.match(/header|footer/g)) {
    return <View />;
  } else {
    const index = props.index;
    const totalQty = props.parentProps.data[0].data.length;
    const styles = createStyles();
    const userId = useSelector(selectUserId);
    const message = props.item;
    const myMessage = message.userId === userId;
    const progress = useRef(new Animated.Value(0)).current;
    const [isExpended, setExpended] = useState(false);
    const { setDateSectionHighlight } = useContext(DateSectionContext);
    const { setUserSectionHighlight } = useContext(UserSectionContext);
    const { setStatusSectionHighlight } = useContext(StatusSectionContext);
    // const { setReacting } = useContext(ChatMessageContext);
    const expend = () => {
      setExpended(false);
      setDateSectionHighlight(false);
      setUserSectionHighlight(false);
      setStatusSectionHighlight(false);
      // setReacting(false);
    };
    const closeExpended = () => {
      setExpended(true);
      setDateSectionHighlight(true);
      setUserSectionHighlight(true);
      setStatusSectionHighlight(true);
      // setReacting(true);
    };
    const pressProgress = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (isExpended) {
        Animated.timing(progress, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(progress, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }, [isExpended]);
    return useMemo(
      () => {
        console.log('re')
        return(
        <View
          style={[
            {
              flexDirection: myMessage ? "row-reverse" : "row",
            },
            index === 1 && { marginTop: 5 },
            index === totalQty && { marginBottom: 5 },
            isExpended && { zIndex: 100 },
          ]}
        >
          <View
            style={{
              maxWidth: "70%",
              flexDirection: myMessage ? "row-reverse" : "row",
              alignItems: "flex-end",
            }}
          >
            {!myMessage && (
              <View style={{ width: 30, height: 30, marginRight: 10 }}>
                {index === totalQty && (
                  <UserIconImage userId={message.userId} />
                )}
              </View>
            )}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  backgroundColor: "black",
                  width: 999999,
                  height: 999999,
                  top: -50000,
                  left: -50000,
                },
                { display: isExpended === false ? "none" : "flex" },
                {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.7],
                  }),
                },
              ]}
            >
              <Pressable
                style={{ width: "100%", height: "100%" }}
                onPress={() => expend()}
              />
            </Animated.View>
            <Pressable
              onPressIn={() => {
                Animated.timing(pressProgress, {
                  toValue: 1,
                  useNativeDriver: false,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(pressProgress, {
                  toValue: 0,
                  friction: 4,
                  useNativeDriver: false,
                }).start();
              }}
              onLongPress={() => {
                Animated.spring(pressProgress, {
                  toValue: 0,
                  friction: 4,
                  useNativeDriver: false,
                }).start();
                closeExpended();
              }}
            >
              <Animated.View
                style={[
                  styles.css.chatBubble,
                  myMessage
                    ? styles.css.chatBubbleSelf
                    : styles.css.chatBubbleOther,
                  index === 1 && {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                  },
                  index === totalQty && {
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                  },
                  message.status === "pending" && { opacity: 0.7 },
                  {
                    transform: [
                      {
                        scale: pressProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.85],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {props.children}
              </Animated.View>
            </Pressable>
          </View>
        </View>
      )},
      [isExpended, props]
    );
  }
};

const ChatBubble = ({ message, index, totalQty }) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const myMessage = message.userId === userId;
  const progress = useRef(new Animated.Value(0)).current;
  const [isExpended, setExpended] = useState(false);
  useEffect(() => {
    // progress.addListener((value) => {
    //   if (value === 0) {
    //     isExpended.current = false;
    //   } else {
    //     isExpended.current = true;
    //   }
    // });
  });
  return (
    <Text style={[styles.css.chatFont, myMessage && styles.css.chatFontSelf]}>
      {/* {message.content} */}
      {Math.random()}
    </Text>
  );
};

const DateSectionTitle = ({ date }) => {
  const styles = createStyles();
  return (
    <View style={styles.css.chatMessageDateSection}>
      <DateShort
        timestamp={date}
        style={[styles.css.subFont, { fontSize: 12 }]}
      />
    </View>
  );
};

const sectioningByMessageDate = (messageData) => {
  const splitTime = 100 * 60 * 30;
  const result = [];
  for (let message of messageData) {
    if (
      !result[result.length - 1]?.date ||
      message.date > result[result.length - 1]?.date + splitTime
    ) {
      result.push({ date: message.date, data: [message] });
    } else {
      result[result.length - 1].data.push(message);
    }
  }
  return result;
};

const sectioningByMessageUserId = (messageData) => {
  const result = [];
  for (let message of messageData) {
    if (
      !result[result.length - 1]?.userId ||
      result[result.length - 1]?.userId !== message.userId
    ) {
      result.push({ userId: message.userId, data: [message] });
    } else {
      result[result.length - 1].data.push(message);
    }
  }
  return result;
};

const sectioningByMessageStatus = (messageData) => {
  const result = [];
  for (let message of messageData) {
    if (
      !result[result.length - 1]?.status ||
      result[result.length - 1]?.status !== message.status
    ) {
      result.push({ status: message.status, data: [message] });
    } else {
      result[result.length - 1].data.push(message);
    }
  }
  return result;
};

const sectioningByMessageMins = (messageData) => {
  const splitTime = 100 * 60 * 5;
  const result = [];
  for (let message of messageData) {
    if (
      !result[result.length - 1]?.date ||
      message.date > result[result.length - 1]?.date + splitTime
    ) {
      result.push({ date: message.date, data: [message] });
    } else {
      result[result.length - 1].data.push(message);
    }
  }
  return result;
};

const Sectioning = (messageData) => {
  console.log('sss')
  const messageDataSectionDate = sectioningByMessageDate(messageData);
  const result = [];
  for (let [
    dateIndex,
    messageSplitByDate,
  ] of messageDataSectionDate.entries()) {
    result.push({
      date: messageSplitByDate.date,
      data: [],
    });
    for (let [userIdIndex, messageSplitByUserId] of sectioningByMessageUserId(
      messageSplitByDate.data
    ).entries()) {
      result[dateIndex].data.push([
        {
          userId: messageSplitByUserId.userId,
          data: [],
        },
      ]);
      for (let [
        statusIndex,
        messsageSplitByStatus,
      ] of sectioningByMessageStatus(messageSplitByUserId.data).entries()) {
        result[dateIndex].data[0][0].data.push([
          {
            status: messsageSplitByStatus.status,
            data: [sectioningByMessageMins(messsageSplitByStatus.data)],
          },
        ]);
      }
    }
  }
  // console.log(result);
  return result;
};

const StatusSection = ({ messageDataSectionStatus }) => {
  const styles = createStyles();
  return (
    <SectionList
      sections={messageDataSectionStatus}
      CellRendererComponent={ChatBubbleView}
      renderItem={({ item, index, section }) => (
        <ChatBubble
          message={item}
          index={index}
          totalQty={section.data.length}
        />
      )}
      // renderSectionHeader={({ section: { date } }) => (
      //   <Text style={styles.css.normalFont}>{date}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => "messageUser" + index}
    />
  );
};

const UserSection = ({ messageDataSectionUserId }) => {
  const styles = createStyles();
  const createStatusSection = (props) => {
    const { setDateSectionHighlight } = useContext(DateSectionContext);
    const { setUserSectionHighlight } = useContext(UserSectionContext);
    const [statusSectionHighlight, setStatusSectionHighlight] = useState(false);
    return (
      <StatusSectionContext.Provider value={{ setStatusSectionHighlight }}>
        <View style={[statusSectionHighlight && { zIndex: 100 }]}>
          {props.children}
        </View>
      </StatusSectionContext.Provider>
    );
  };
  return (
    <SectionList
      sections={messageDataSectionUserId}
      CellRendererComponent={createStatusSection}
      renderItem={({ item }) => (
        <StatusSection messageDataSectionStatus={item} />
      )}
      // renderSectionHeader={({ section: { status } }) => (
      //   <Text style={styles.css.normalFont}>{status}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => "messageUser" + index}
    />
  );
};

const DateSection = ({ messageDataSectionDate }) => {
  const styles = createStyles();
  const createUserSection = (props) => {
    const { setDateSectionHighlight } = useContext(DateSectionContext);
    const [userSectionHighlight, setUserSectionHighlight] = useState(false);
    return (
      <UserSectionContext.Provider value={{ setUserSectionHighlight }}>
        <View style={[userSectionHighlight && { zIndex: 100 }]}>
          {props.children}
        </View>
      </UserSectionContext.Provider>
    );
  };
  return (
    <SectionList
      sections={messageDataSectionDate}
      CellRendererComponent={createUserSection}
      renderItem={({ item }) => <UserSection messageDataSectionUserId={item} />}
      // renderSectionHeader={({ section: { userId } }) => (
      //   <Text style={styles.css.normalFont}>{userId}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => "messageUser" + index}
    />
  );
};
/* 
Structure
  date
    user
      type
        
        readed (5mins/section)
        unreaded/pending/ (5mins/section)

  [{date,[{user,[{type,[{readed,[{5mins/section},...]},...]},...]},...]},...]
 */

const ChatMessageContent = ({ contactId }) => {
  const styles = createStyles();
  const { messageData, contactIndex } = useContext(ChatMessageContext);
  const messageDataSectionDate = useMemo(
    () => Sectioning(messageData).reverse(),
    [messageData]
  );
  const createDateSection = (props) => {
    const [dateSectionHighlight, setDateSectionHighlight] = useState(false);
    return (
      <DateSectionContext.Provider value={{ setDateSectionHighlight }}>
        <View
          style={[
            { transform: [{ scaleY: -1 }] }, //inverted
            dateSectionHighlight && { zIndex: 100 },
          ]}
        >
          {props.children}
        </View>
      </DateSectionContext.Provider>
    );
  };
  return useMemo(
    () => (
      <SectionList
        sections={messageDataSectionDate}
        CellRendererComponent={createDateSection}
        renderItem={({ item }) => <DateSection messageDataSectionDate={item} />}
        renderSectionFooter={({ section: { date } }) => (
          <DateSectionTitle date={date} />
        )}
        keyExtractor={(item, index) => "messageDate" + index}
        contentContainerStyle={styles.css.chatMessageContainer}
        ListFooterComponent={
          <ChatMessageHeaderUserInfo contactId={contactId} />
        }
        initialScrollIndex={0}
        inverted={-1}
      />
    ),
    [messageDataSectionDate, contactId]
  );
};

export default ChatMessageContent;
