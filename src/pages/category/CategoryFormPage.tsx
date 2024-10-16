import {Button, View} from "react-native";

export default function CategoryFormPage({navigation}) {
    return <View>
        <Button onPress={() => navigation.goBack()} title="Go back home"/>
    </View>
}