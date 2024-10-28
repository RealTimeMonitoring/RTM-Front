import { TextInput, View } from "react-native"
import { styles } from "./styles";

type Props = {
    value: any;
    event: any;
}

export default function Input( {value, event}: Props )
{
    return (
        <View style={styles.group}>
            <TextInput  style={styles.field} value={value} onChangeText={event}>

            </TextInput>
        </View>
    );
}