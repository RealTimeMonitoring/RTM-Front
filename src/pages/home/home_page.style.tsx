import {StyleSheet} from 'react-native';

export const homeStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        paddingTop: 50,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonsContainer: {
        flex: 2,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    button: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: '#060606',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});