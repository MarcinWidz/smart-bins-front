import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as COLORS from "../../composants/Colors.js";

function RoundedButton({ label, onPress, colored }) {
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
          backgroundColor: colored ? COLORS.AGORIQUE_BLUE : COLORS.WHITE,
          borderColor: COLORS.AGORIQUE_BLUE,
          borderWidth: 2,
          borderStyle: "solid",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: componentHeight / 5,
        }}
      >
        <Text
          style={{
            fontSize: componentHeight / 2.5,
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

const styles = StyleSheet.create({
  label: {
    color: COLORS.WHITE,
  },
});

export default RoundedButton;
