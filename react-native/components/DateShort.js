import React from "react";
import { View, Text } from "react-native";
import {
  format,
  isThisYear,
  isThisMonth,
  isThisWeek,
  isYesterday,
  isToday,
} from "date-fns";

const DateShort = ({ timestamp, style }) => {
  let result = "";
  switch (true) {
    case isToday(timestamp):
      result = format(timestamp, "HH:mm");
      break;
    case isYesterday(timestamp):
      result = "Yesterday " + format(timestamp, " HH:mm");
      break;
    case isThisWeek(timestamp):
      result = format(timestamp, "EEE HH:mm");
      break;
    case isThisMonth(timestamp):
      result = format(timestamp, "dd MMM, HH:mm");
      break;
    case isThisYear(timestamp):
      result = format(timestamp, "dd MMM, HH:mm");
      break;
    default:
      result = format(timestamp, "YYYY, dd MMM, HH:mm");
  }
  return <Text style={style}>{result.toUpperCase()}</Text>;
};

export default DateShort;
