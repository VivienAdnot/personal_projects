export const storeJwtToken = (jwtToken) => {

    window.localStorage.setItem('jwtToken', jwtToken);

};

export const getJwtToken = () => {

    return window.localStorage.getItem('jwtToken');

};

export const storeUser = (user) => {

    window.localStorage.setItem('user', JSON.stringify(user));

}

export const getUser = () => {

    const user = window.localStorage.getItem('user');
    return (user) ? JSON.parse(user) : null;

};