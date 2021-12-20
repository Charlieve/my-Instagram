import React, { useContext } from "react";
import { ScrollView, View, Text, SectionList } from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import createStyles from "../styles/styles";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import ChatMessageHeaderUserInfo from "./ChatMessageHeaderUserInfo";
import UserIconImage from "./UserIconImage";
import TimeAgo from "./TimeAgo";
import DateShort from "./DateShort";

const ChatBubble = ({ message, index, totalQty }) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const myMessage = message.userId === userId;
  return (
    <View
      style={[
        {
          flexDirection: myMessage ? "row-reverse" : "row",
        },
        index === 0 && { marginTop: 5 },
        index + 1 === totalQty && { marginBottom: 5 },
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
            {index + 1 === totalQty && (
              <UserIconImage userId={message.userId} />
            )}
          </View>
        )}
        <View
          style={[
            styles.css.chatBubble,
            myMessage ? styles.css.chatBubbleSelf : styles.css.chatBubbleOther,
            index === 0 && {
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            },
            index + 1 === totalQty && {
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
            },
            message.status === "pending" && { opacity: 0.7 },
          ]}
        >
          <Text
            style={[styles.css.chatFont, myMessage && styles.css.chatFontSelf]}
          >
            {message.content}
          </Text>
        </View>
      </View>
    </View>
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

const sectioningByMessageData = (messageData) => {
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
  const messageDataSectionDate = sectioningByMessageData(messageData);
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
  console.log(result);
  return result;
};

const StatusSection = ({ messageDataSectionStatus }) => {
  const styles = createStyles();
  return (
    <SectionList
      sections={messageDataSectionStatus}
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
  return (
    <SectionList
      sections={messageDataSectionUserId}
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
  return (
    <SectionList
      sections={messageDataSectionDate}
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
  const messageDataSectionDate = Sectioning(messageData);
  return (
    <SectionList
      sections={messageDataSectionDate}
      renderItem={({ item }) => <DateSection messageDataSectionDate={item} />}
      renderSectionHeader={({ section: { date } }) => (
        <DateSectionTitle date={date} />
      )}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => "messageDate" + index}
      contentContainerStyle={styles.css.chatMessageContainer}
      ListHeaderComponent={<ChatMessageHeaderUserInfo contactId={contactId} />}
      // inverted={-1}
    />
  );
};

export default ChatMessageContent;
