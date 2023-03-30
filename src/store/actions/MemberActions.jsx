import {
    inviteMember,
    bulkInviteMember,
    getInvitations,
    cancelInvitation,
    formatInvitations
} from '../../services/MemberService.jsx';
import {
    CONFIRMED_INVITE_ACTION,
    CONFIRMED_BULK_INVITE_ACTION,
    CONFIRMED_GET_INVITATIONS,
    CONFIRMED_CANCEL_INVITE_ACTION,
    INVITE_RESET_ACTION
} from './MemberTypes';


//single invite
export function inviteMemberAction(name,email,department,designation,history) {
    return (dispatch, getState) => {
        inviteMember({name,email,department,designation}).then((response) => {
            dispatch(confirmedInviteAction(response.data));
            /* if(response.data.status){
                dispatch(confirmedInviteAction(response.data));
                //history.push('/members');
            }else{
                dispatch(confirmedInviteAction(response.data));
            } */
        });
    };
}

export function confirmedInviteAction(data) {
    return {
        type: CONFIRMED_INVITE_ACTION,
        payload: data,
    };
}

//bulk invite
export function bulkInviteMemberAction(invitations,history) {
    return (dispatch, getState) => {
        bulkInviteMember({invitations}).then((response) => {
            dispatch(confirmedBulkInviteAction(response.data));
            /* if(response.data.status){
                dispatch(confirmedBulkInviteAction(response.data));
                //history.push('/members');
            }else{
                dispatch(confirmedBulkInviteAction(response.data));
            } */
        });
    };
}

export function confirmedBulkInviteAction(data) {
    return {
        type: CONFIRMED_BULK_INVITE_ACTION,
        payload: data,
    };
}

export function resetAllAction(data) {
    return (dispatch, getState) => {
        dispatch(confirmedResetAction({}));
    }
}

export function confirmedResetAction(data) {
    return {
        type: INVITE_RESET_ACTION,
        payload: data,
    };
}

//invitations list
export function getInvitationsAction(filter) {
    return (dispatch, getState) => {
        getInvitations(filter).then((response) => {
			console.log(response);

            if(response.data.status){
                //let invitations = formatInvitations(response.data.invitations);
                dispatch(confirmedGetInvitationsAction(response.data.members));
            }else{
                dispatch(confirmedGetInvitationsAction([]));
            }
            
        });
    };
}

export function confirmedGetInvitationsAction(members) {
    return {
        type: CONFIRMED_GET_INVITATIONS,
        payload: members,
    };
}

//cancel invite
export function cancelInvitationAction(id,history) {
    return (dispatch, getState) => {
        cancelInvitation({"invitation_id":id}).then((response) => {
            dispatch(confirmedCancelInviteAction(response.data));
            /* if(response.data.status){
                dispatch(confirmedCancelInviteAction(response.data));
                //history.push('/members');
            }else{
                dispatch(confirmedCancelInviteAction(response.data));
            } */
        });
    };
}

export function confirmedCancelInviteAction(data) {
    return {
        type: CONFIRMED_CANCEL_INVITE_ACTION,
        payload: data,
    };
}


