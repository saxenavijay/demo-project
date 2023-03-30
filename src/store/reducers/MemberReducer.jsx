import {
    CONFIRMED_INVITE_ACTION,
    CONFIRMED_BULK_INVITE_ACTION,
    CONFIRMED_GET_INVITATIONS,
    CONFIRMED_CANCEL_INVITE_ACTION,
    INVITE_RESET_ACTION
} from '../actions/MemberTypes';

const initialState = {
    invitations: [],
    newInvite:null,
    bulkInvite:null,
    cancelInvite:null
};

export default function InvitationsReducer(state = initialState, actions) {
    if (actions.type === CONFIRMED_INVITE_ACTION) {
        return {
            ...state,
            newInvite:actions.payload,
            invitations:state.invitations,
            cancelInvite:null,
            bulkInvite:null,
        };
    }

    if (actions.type === CONFIRMED_BULK_INVITE_ACTION) {
        return {
            ...state,
            bulkInvite:actions.payload,
            invitations:state.invitations,
            cancelInvite:null,
            newInvite:null,
        };
    }

    if (actions.type === CONFIRMED_CANCEL_INVITE_ACTION) {
        return {
            ...state,
            cancelInvite:actions.payload,
            invitations:state.invitations,
            newInvite:null,
            bulkInvite:null,
        };
    }

    if (actions.type === INVITE_RESET_ACTION) {
        return {
            ...state,
            cancelInvite:null,
            newInvite:null,
            bulkInvite:null,
            invitations:state.invitations,
        };
    }

    if (actions.type === CONFIRMED_GET_INVITATIONS) {
        return {
            ...state,
            invitations: actions.payload,
            cancelInvite:null,
            newInvite:null,
            bulkInvite:null,
        };
    }
    return state;
}
