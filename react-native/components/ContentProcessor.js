import React from "react";
import { Text } from "react-native";
import createStyles from "../styles/styles";


export default function ContentProcessor({ content }) {
    const styles = createStyles();
    let fullContent = content.match(/[^\s]+|\n/g);
    const regex = new RegExp("^[#@].+");
    fullContent.forEach((string, index) => {
      if (regex.test(string)) {
        fullContent[index] = (
          <Text key={index} style={styles.css.hrefFont}>
            {fullContent[index - 1] !== "\n" && " "}
            {string}
          </Text>
        );
      } else {
        fullContent[index] =
          fullContent[index - 1] !== "\n" && fullContent[index] !== "\n"
            ? " " + string
            : string;
      }
    });
    return fullContent;
  }