import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://www.vaniercollege.qc.ca/wp-content/themes/vaniermain/images/logo.png' }}
                    style={styles.logo}
                />
            </View>
            <Text style={styles.about}>
                My name is <Text style={{fontWeight: 'bold'}}>Vipul Chitral</Text>,  born and brought up in Delhi, India.

                {'\n\n'} Currently I am studying Software Development at Vanier College in  <Text style={{fontWeight: 'bold'}}>Montreal, Canada.</Text>

                {'\n\n'}I can develop projects on Java, JavaScript,HTML,CSS, C#.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    logo: {
        backgroundColor: 'red',
        width: 200,
        height: 60,
    },
    about: {
        fontSize: 18,
        marginVertical: 10,
    }
})
export default AboutScreen;