import * as React from "react";
import { Text, View } from "react-native";

import * as COLORS from "../../composants/Colors.js";

function ErrorMessage({ message }) {
  let [componentHeight, setComponentHeight] = React.useState(0);
  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        setComponentHeight(event.nativeEvent.layout.height);
      }}
    >
      <Text style={{ color: COLORS.RED_CRIMSON, fontSize: componentHeight }}>
        {message}
      </Text>
    </View>
  );
}

export default ErrorMessage;
