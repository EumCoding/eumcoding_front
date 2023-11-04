export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const CLEAR_ACCESS_TOKEN = 'CLEAR_ACCESS_TOKEN';
export const SET_ROLE = 'SET_ROLE'
export const SET_MEMBER_ID = 'SET_MEMBER_ID'



export const setLoggedIn = (loggedIn) => ({
    type: SET_LOGGED_IN,
    payload: loggedIn,
});

export const setAccessToken = (accessToken) => ({
    type: SET_ACCESS_TOKEN,
    payload: accessToken,
});

export const clearAccessToken = () => ({
    type: CLEAR_ACCESS_TOKEN
});

export const setRole = (role) => ({
    type: SET_ROLE,
    payload: role,
})

export const setMemberId = (memberId) => ({
    type: SET_MEMBER_ID,
    payload: memberId,
})
