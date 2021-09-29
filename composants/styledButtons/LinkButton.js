import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as COLORS from "../../composants/Colors.js";

function LinkButton({ label, onPress, colored }) {
  let [componentHeight, setComponentHeight] = React.useState(0);
  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        setComponentHeight(event.nativeEvent.layout.height);
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: componentHeight / 3.5,
            textDecorationStyle: "solid",
            textDecorationLine: "underline",
            fontWeight: "600",
            color: colored ? COLORS.WHITE : COLORS.AGORIQUE_BLUE,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default LinkButton;
