import {Button, View} from "react-native";

export default function CategoryFormPage(props: {navigation: any}) {
    return <View>
        <Button onPress={() => props.navigation.goBack()} title="Go back home"/>
    </View>
}