const initialState = {
    accessToken: null,
    role:999,

};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: action.payload,
            };
        case 'CLEAR_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: null,
            };
        case 'SET_ROLE':
            return{
                ...state,
                role: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;