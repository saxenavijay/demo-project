import axios from 'axios';

export function getInvitations(filter) {
    return axios.post(`http://localhost:5000/api/agent/members`,filter);
}

export function inviteMember(postData) {
    return axios.post(`http://localhost:5000/api/agent/invite`, postData);
}

export function bulkInviteMember(postData) {
    return axios.post(`http://localhost:5000/api/agent/bulk-invite`, postData);
}

export function cancelInvitation(postData) {
    return axios.post(`http://localhost:5000/api/agent/cancel-invite`, postData);
}

export function formatInvitations(inviteData) {
    let invitations = [];
    for (let key in inviteData) {
        invitations.push({ ...inviteData[key], id: key });
    }

    return invitations;
}
