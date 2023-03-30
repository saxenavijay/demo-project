import axios from 'axios';

export function getPosts() {
    return axios.get(`http://localhost:5000/api/posts.json`);
}

export function createPost(postData) {
    return axios.post(`http://localhost:5000/api/posts.json`, postData);
}

export function updatePost(post, postId) {
    return axios.put(`http://localhost:5000/api/posts/${postId}.json`, post);
}

export function deletePost(postId) {
    return axios.delete(`http://localhost:5000/api/posts/${postId}.json`);
}

export function formatPosts(postsData) {
    let posts = [];
    for (let key in postsData) {
        posts.push({ ...postsData[key], id: key });
    }

    return posts;
}
