import AsyncStorage from "@react-native-async-storage/async-storage";   
import { Platform } from "react-native";

const isWeb = Platform.OS === 'web';

export const storageService = {
    async setItem(key: string, value: any) 
    {
        const jsonValue = JSON.stringify(value);

        if ( isWeb )
        {
            localStorage.setItem( key, jsonValue );
        }

        else
        {
            await AsyncStorage.setItem( key, jsonValue );
        }
    },

    async getItem(key: string) 
    {
        console.log('isWeb:', isWeb);
        if ( isWeb )
        {
            const jsonValue = localStorage.getItem( key );
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        }

        else
        {
            console.log(AsyncStorage.getItem( key ))
            const jsonValue = await AsyncStorage.getItem( key );
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        }
    },

    async removeItem(key: string) 
    {
        if ( isWeb )
        {
            localStorage.removeItem( key );
        }

        else
        {
            await AsyncStorage.removeItem( key );
        }
    },
};