import * as actionTypes from "../actions/cardConstants";


export const getAllCardReducer = (state = {cards : []}, action) => {
  switch (action.type) {
    case actionTypes.CARDS_REQUEST:
      return {
        allCardLoading: true,
        cards: [],
      };
    case actionTypes.CARDS_SUCCESS:
      return {
        cards: action.payload,
        allCardLoading: false,
      };
    case actionTypes.CARDS_FAIL:
      return {
        allCardLoading: false,
        allCardError: action.payload,
      };
    default:
      return state;
  }
};

export const getCardDetailsReducer = (state = {card : null}, action) => {
  switch (action.type) {
    case actionTypes.CARD_DETAILS_REQUEST:
      return {
        cardLoading: true,
      };
    case actionTypes.CARD_DETAILS_SUCCESS:
      return {
        card: action.payload,
        cardLoading: false,
      };
    case actionTypes.CARD_DETAILS_FAIL:
      return {
        cardLoading: false,
        cardError: action.payload,
      };
    default:
      return state;
  }
};

export const getAllProfileReducer = (state = {profiles : []}, action) => {
  switch (action.type) {
    case actionTypes.PROFILES_REQUEST:
      return {
        allProfileLoading: true,
        profiles: [],
      };
    case actionTypes.PROFILES_SUCCESS:
      return {
        profiles: action.payload,
        allProfileLoading: false,
      };
    case actionTypes.PROFILES_FAIL:
      return {
        allProfileLoading: false,
        allProfileError: action.payload,
      };
    default:
      return state;
  }
};


export const getProfileDetailsReducer = (state = {profile : null}, action) => {
  switch (action.type) {
    case actionTypes.PROFILE_DETAILS_REQUEST:
      return {
        profileLoading: true,
      };
    case actionTypes.PROFILE_DETAILS_SUCCESS:
      return {
        profile: action.payload,
        profileLoading: false,
      };
    case actionTypes.PROFILE_DETAILS_FAIL:
      return {
        profileLoading: false,
        profileError: action.payload,
      };
    default:
      return state;
  }
};


export const activeProfileReducer = (state = {isProfileActivated : false}, action) => {
  switch (action.type) {
    case actionTypes.ACTIVE_PROFILE_REQUEST:
      return {
        activeProfileLoading: true,
      };
    case actionTypes.ACTIVE_PROFILE_SUCCESS:
      return {
        activeProfileLoading: false,
        isProfileActivated:action.payload
      };
    case actionTypes.ACTIVE_PROFILE_FAIL:
      return {
        activeProfileLoading: false,
        activeProfileError: action.payload,
      };
    case actionTypes.ACTIVE_PROFILE_RESET:
      return {
        activeProfileLoading: false,
        isProfileActivated:false
      };
    default:
      return state;
  }
};


export const saveProfileReducer = (state = {isProfileSaved : false}, action) => {
  switch (action.type) {
    case actionTypes.SAVE_PROFILE_REQUEST:
      return {
        ...state,
        saveProfileLoading: true,
      };
    case actionTypes.SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        saveProfileLoading: false,
        isProfileSaved:action.payload
      };
    case actionTypes.SAVE_PROFILE_FAIL:
      return {
        ...state,
        saveProfileLoading: false,
        saveProfileError: action.payload,
      };

      case actionTypes.SAVE_PROFILE_RESET:
        return {
          saveProfileLoading: false,
          isProfileSaved:false
        };
    default:
      return state;
  }
};


export const addProfileReducer = (state = {isProfileAdded : false}, action) => {
  switch (action.type) {
    case actionTypes.ADD_PROFILE_REQUEST:
      return {
        ...state,
        addProfileLoading: true,
      };
    case actionTypes.ADD_PROFILE_SUCCESS:
      return {
        ...state,
        addProfileLoading: false,
        isProfileAdded:action.payload
      };
    case actionTypes.ADD_PROFILE_FAIL:
      return {
        ...state,
        addProfileLoading: false,
        addProfileError: action.payload,
      };
      case actionTypes.ADD_PROFILE_RESET:
        return {
          addProfileLoading: false,
          isProfileAdded:false
        };
    default:
      return state;
  }
};


