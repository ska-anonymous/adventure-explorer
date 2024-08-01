import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { DatabaseContext } from '../DatabaseContext';

const DestinationListScreen = () => {
    const { db } = useContext(DatabaseContext);
    const {listRefresh} = useContext(DatabaseContext);

    const [places, setPlaces] = useState([]);


    useEffect(() => {
        fetchPlaces();
    }, [listRefresh])


    const fetchPlaces = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places',
                [],
                (_, { rows }) => {
                    setPlaces(rows._array);
                },
                (_, error) => {
                    console.error('error occurred while fetching data', error);
                }
            );
        });
    };

    const handleDelete = (index) => {
        const placeId = places[index]['id'];
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM Places WHERE id=?`,
                [placeId],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0)
                        console.log(placeId, ' deleted succesfully');
                    else
                        console.log('error ', placeId, ' was not deleted');
                },
                (_, error) => {
                    console.log('error deleting place', error);
                }
            )
        })
        fetchPlaces();
    }

    return (
        <ScrollView>
            {places.map((place, index) => {
                return (
                    <React.Fragment key={'place-' + index}>
                        <View style={styles.hr}>
                            <Text style={styles.placeName}>{place['place_name']}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>{place['latitude']}</Text>
                                <Text>{place['longitude']}</Text>
                                <Text>{place['post_code']}</Text>
                            </View>
                            <Text>{place['description']}</Text>
                            <View style={styles.buttonsContainer}>
                                
                                <Button
                                    title='delete'
                                    onPress={() => { handleDelete(index) }}
                                />
                            </View>
                        </View>
                    </React.Fragment>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    placeName: {
        fontWeight: 'bold',

    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 5,
    }
})

export default DestinationListScreen;