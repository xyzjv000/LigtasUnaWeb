import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import faker from 'faker';
import axios from 'axios';
function Faker() {
    let createUserApiUrl = 'https://ligtasunaapi.azurewebsites.net/api/user?type=user';
    let subscribeApi = 'https://ligtasunaapi.azurewebsites.net/api/subscription';
    const generateFakeUserNoSub = async () => {
        for (let index = 0; index < 50; index++) {
            let body = {
                user_fname: faker.name.firstName(),
                user_lname: faker.name.lastName(),
                user_address: faker.address.cityName(),
                user_conNum: faker.phone.phoneNumber('09#########'),
                username: faker.internet.email(),
                password: faker.internet.password(),
                location_long: faker.address.longitude(),
                location_lat: faker.address.longitude(),
            };
            await axios.post(createUserApiUrl, body).then((res) => {
                if (res.data.length > 0) {
                    console.log('User Added');
                }
            });
        }
    };

    const generateFakeUserSub = async () => {
        for (let index = 0; index < 50; index++) {
            let body = {
                user_fname: faker.name.firstName(),
                user_lname: faker.name.lastName(),
                user_address: faker.address.cityName(),
                user_conNum: faker.phone.phoneNumber('09#########'),
                username: faker.internet.email(),
                password: faker.internet.password(),
                location_long: faker.address.longitude(),
                location_lat: faker.address.longitude(),
            };

            await axios.post(createUserApiUrl, body).then((res) => {
                if (res.data.length > 0) {
                    axios.post(subscribeApi, { users: { user_ID: res.data[0].user_ID } });
                    console.log('User Added and subscribed');
                }
            });
        }
    };

    const generateFeedback = async () => {
        for (let index = 0; index < 100; index++) {
            let randomFeed = Math.floor(Math.random() * 3) + 1;
            let randomUser = Math.floor(Math.random() * (255 - 106 + 1)) + 106;
            let data = {
                feed_Descrp: faker.commerce.productDescription(),
                firstaids: {
                    faidPR_ID: randomFeed,
                },
                users: {
                    user_ID: randomUser,
                },
            };

            console.log(data);
            await axios.post(`https://ligtasunaapi.azurewebsites.net/api/feedback`, data).then((res) => {
                if (res.data.length > 0) {
                    console.log('Feedback Posted!');
                }
            });
        }
    };
    return (
        <div style={{ position: 'absolute', bottom: 20 }}>
            <Button variant="outlined" onClick={generateFakeUserSub}>
                Generate 50 users with subscription
            </Button>
            <Button variant="outlined" onClick={generateFakeUserNoSub}>
                Generate 50 users with no subscription
            </Button>
            <Button variant="outlined" onClick={generateFeedback}>
                Generate 100 Feedbacks
            </Button>
        </div>
    );
}

export default Faker;
