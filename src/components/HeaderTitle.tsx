import {Button, Text, View} from "react-native";
import * as React from "react";

export default function HeaderTitle({props}) {
    return <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <Text>{props.children}</Text>
        <Button title="teste"/>
    </View>
}