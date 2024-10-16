import * as React from 'react';
import {Button, View} from "react-native";
import {insuranceStyle} from "./insurance_page.style";

export default function InsuranceClaimPage({navigation}) {
    return (
        <View style={insuranceStyle.container}>
            <Button onPress={() => navigation.goBack()} title="Go back home"/>
        </View>
    );
}