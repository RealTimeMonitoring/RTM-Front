import {Button, View} from "react-native";

export default function HeatMapPage({navigation}) {
    return <View>
        <Button onPress={() => navigation.goBack()} title="Go back home"/>
    </View>
}