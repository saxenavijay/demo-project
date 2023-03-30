import * as actionTypes from "./cardConstants";
import axios from 'axios';

export const getAllCards = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CARDS_REQUEST });

    //let fd = new FormData();
    //fd.append('is_corporate', true);

    const { data } = await axios.get("http://localhost:5000/api/cards",{ params:{is_corporate:true} });

    console.log("card - "+JSON.stringify(data));

    if(data.status){

      console.log("card success");

      dispatch({
        type: actionTypes.CARDS_SUCCESS,
        payload: data.cards,
      });
    }else{
      console.log("card fail");
      dispatch({
        type: actionTypes.CARDS_FAIL,
        payload: data.message,
      });
    }

  
  } catch (error) {
    dispatch({
      type: actionTypes.CARDS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getCardDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CARD_DETAILS_REQUEST });

   

    const { data } = await axios.get(`http://localhost:5000/api/cards/${id}`,{ params:{is_corporate:true} });

    console.log("card details - "+JSON.stringify(data));

    if(data.status){
      console.log("card details success");
      dispatch({
        type: actionTypes.CARD_DETAILS_SUCCESS,
        payload: data.card,
      });

    }else{
      console.log("card details fail");
      dispatch({
        type: actionTypes.CARD_DETAILS_FAIL,
        payload: data.message,
      });

    }

 
    
  } catch (error) {
    console.log("card details error");
    dispatch({
      type: actionTypes.CARD_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const getAllProfiles = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.PROFILES_REQUEST });

    let fd = new FormData();
    fd.append('is_corporate', true);

    const { data } = await axios.post("http://localhost:5000/api/profiles",fd);

    dispatch({
      type: actionTypes.PROFILES_SUCCESS,
      payload: data.profiles,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.PROFILES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const getProfileDetails = (profileId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.PROFILE_DETAILS_REQUEST });   

    const { data } = await axios.get(`http://localhost:5000/api/profiles/${profileId}`);

    console.log("profile details - "+JSON.stringify(data));

    if(data.status){
      console.log("profile details success");
      dispatch({
        type: actionTypes.PROFILE_DETAILS_SUCCESS,
        payload: data.profile,
      });

    }else{
      console.log("profile details fail");
      dispatch({
        type: actionTypes.PROFILE_DETAILS_FAIL,
        payload: data.message,
      });

    }
    
  } catch (error) {
    console.log("profile details error");
    dispatch({
      type: actionTypes.PROFILE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const activeProfile = (cardId,profileId,name) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ACTIVE_PROFILE_REQUEST });

   


    let fd = new FormData();
    fd.append('card_id', cardId);
    fd.append('profile_id', profileId);
    fd.append('name', name);

    console.log("activeProfile called , cardId - "+cardId+", profile Id - "+profileId);

    const { data } = await axios.post(`http://localhost:5000/api/profiles/active`,fd);

    console.log("active profile - "+JSON.stringify(data));

    dispatch({
      type: actionTypes.ACTIVE_PROFILE_SUCCESS,
      payload: data.status,
    });
    
  } catch (error) {
    dispatch({
      type: actionTypes.ACTIVE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const resetActiveProfile = () => async (dispatch) => {
    dispatch({ type: actionTypes.ACTIVE_PROFILE_RESET });

};


export const resetSaveProfile = () => async (dispatch) => {
  dispatch({ type: actionTypes.SAVE_PROFILE_RESET });

};

export const resetAddProfile = () => async (dispatch) => {
  dispatch({ type: actionTypes.ADD_PROFILE_RESET });

};


export const saveProfile = (profile) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.SAVE_PROFILE_REQUEST });

    console.log("save profile start - "+JSON.stringify(profile))

    let fd = new FormData();

    //user data exist
    //if (user) {
    //fd.append('userId', user.id);
    //}

    /* fd.append('profile_id', profile.id);
    fd.append('name_prefix', profile.name_prefix);
    fd.append('name', profile.name);
    fd.append('company', profile.company);
    fd.append('designation', profile.designation);

    fd.append('websites', JSON.stringify(profile.websites));
    fd.append('emails', JSON.stringify(profile.emails));
    fd.append('phones', JSON.stringify(profile.phones));
    fd.append('addresses', JSON.stringify(profile.addresses));
    fd.append('social_accounts', JSON.stringify(profile.social_accounts)); */


    //fd.append('type', profile.type);
    fd.append('profile_id', profile.id);
    fd.append('profile_name', profile.profile_name);

    if(profile.typeId == 0){
      fd.append('name_prefix', profile.name_prefix);
      fd.append('name', profile.name);
      fd.append('company', profile.company);
      fd.append('designation', profile.designation);
  
      fd.append('websites', JSON.stringify(profile.websites));
      fd.append('emails', JSON.stringify(profile.emails));
      fd.append('phones', JSON.stringify(profile.phones));
      fd.append('addresses', JSON.stringify(profile.addresses));
      fd.append('social_accounts', JSON.stringify(profile.social_accounts));
    }else{
      fd.append('link', profile.link);
    }


   

    const { data } = await axios.post(`http://localhost:5000/api/profiles/save`,fd);

    console.log("save profile response - "+JSON.stringify(data))


    if(data.status){
      dispatch({
        type: actionTypes.SAVE_PROFILE_SUCCESS,
        payload: true,
      });
    }else{
      dispatch({
        type: actionTypes.SAVE_PROFILE_FAIL,
        payload:data.message
      });
    }

    
    
  } catch (error) {
    dispatch({
      type: actionTypes.SAVE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



export const addProfile = (profile) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_PROFILE_REQUEST });

    console.log("add profile start - "+JSON.stringify(profile))

    let fd = new FormData();

    //user data exist
    //if (user) {
    //fd.append('userId', user.id);
    //}

    fd.append('type', profile.type);
    fd.append('is_corporate', true);
    fd.append('profile_name', profile.profile_name);

    if(profile.typeId == 0){
      fd.append('name_prefix', profile.name_prefix);
      fd.append('name', profile.name);
      fd.append('company', profile.company);
      fd.append('designation', profile.designation);
  
      fd.append('websites', JSON.stringify(profile.websites));
      fd.append('emails', JSON.stringify(profile.emails));
      fd.append('phones', JSON.stringify(profile.phones));
      fd.append('addresses', JSON.stringify(profile.addresses));
      fd.append('social_accounts', JSON.stringify(profile.social_accounts));

    }else{

      fd.append('link', profile.link);
    
    }

   

    const { data } = await axios.post(`http://localhost:5000/api/corporate/add-profile`,fd);

    console.log("add profile response - "+JSON.stringify(data))


    if(data.status){
      dispatch({
        type: actionTypes.ADD_PROFILE_SUCCESS,
        payload: true,
      });
    }else{
      dispatch({
        type: actionTypes.ADD_PROFILE_FAIL,
        payload:data.message
      });
    }

    
    
  } catch (error) {
    dispatch({
      type: actionTypes.ADD_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

