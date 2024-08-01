import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DatabaseContext } from '../DatabaseContext';

const NewDestinationScreen = () => {
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [searchedPlaces, setSearchedPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [description, setDescription] = useState('');

    const { db } = useContext(DatabaseContext);
    const {setListRefresh} = useContext(DatabaseContext);


    const handleSearch = async () => {
        setSearchedPlaces([]);
        setSelectedPlace(null);
        try {
            const response = await fetch(`https://api.zippopotam.us/${country}/${state}/${city}`);
            const data = await response.json();

            data['places'] ? setSearchedPlaces(data['places']) : setSearchedPlaces([]);

        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    const handlePlaceSelect = (index) => {
        setSelectedPlace(index);
    }

    const handleSave = () => {

        // check if the place is not selected
        if (selectedPlace == null) {
            console.log('please first select a place to save');
            return;
        }

        const latitude = searchedPlaces[selectedPlace]['latitude'];
        const longitude = searchedPlaces[selectedPlace]['longitude'];
        const placeName = searchedPlaces[selectedPlace]['place name'];
        const postCode = searchedPlaces[selectedPlace]['post code'];


        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO Places (latitude, longitude, place_name, post_code, description) VALUES (?, ?, ?, ?, ?)',
                [latitude, longitude, placeName, postCode, description],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        console.log('Data saved successfully.');
                    } else {
                        console.log('Data could not be saved.');
                    }
                },
                (_, error) => {
                    console.error('Failed to save data table:', error);
                }
            );
        });
        setListRefresh(prevValue => !prevValue);
    }

    const displaySearchedPlaces = () => {
        return (
            <View>
                {searchedPlaces.map((place, index) => {
                    return (
                        <TouchableOpacity
                            key={'touchable-' + index}
                            onPress={() => { handlePlaceSelect(index) }}
                        >
                            <Text key={'place-' + index} style={index === selectedPlace ? styles.selected : {}}>{place['place name']}</Text>
                        </TouchableOpacity>
                    )
                })}

                {searchedPlaces.length > 0 && selectedPlace != null && <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.description}
                    multiline={true}
                />
                }

                {searchedPlaces.length > 0 && selectedPlace != null &&
                    <Button
                        title='Save'
                        onPress={handleSave}
                    />
                }
            </View>
        )

    }

    return (
        <ScrollView style={{ padding: 5, }}>
            <TextInput
                placeholder="Country (e.g CA)"
                value={country}
                onChangeText={setCountry}
                style={styles.input}
            />
            <TextInput
                placeholder="State (e.g QC)"
                value={state}
                onChangeText={setState}
                style={styles.input}
            />
            <TextInput
                placeholder="City (e.g Montreal)"
                value={city}
                onChangeText={setCity}
                style={styles.input}
            />

            <View style={{ marginVertical: 10, width: '30%' }}>
                <Button title="Search" onPress={handleSearch} />
            </View>

            {displaySearchedPlaces()}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    description: {
        borderWidth: 1,
        borderColor: 'blue',
        marginBottom: 10,
    },
    selected: {
        backgroundColor: 'blue',
        color: 'white'
    }
})

export default NewDestinationScreen;
