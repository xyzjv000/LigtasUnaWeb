import React, { useState } from 'react';

const initialState = {
    user_ID: null,
    user_Type: null,
    user_Fname: null,
    user_Lname: null,
    user_Address: null,
    user_ConNum: null,
    username: null,
    location_Long: null,
    location_Lat: null,
    reports: 0,
    org_id: null,
    org_name: null,
    org_contact_person: null,
    org_contact_number: null,
    api_url: 'https://ligtasunaapi.azurewebsites.net/api/',
};

export const Context = React.createContext();

const Store = ({ children }) => {
    const [user, setUser] = useState(initialState);
    return <Context.Provider value={[user, setUser]}>{children}</Context.Provider>;
};

export default Store;
