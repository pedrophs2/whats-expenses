const sessions = {};

const users = {
    '240917768327370': 'Pedro',
    '5364414206137': 'Valesca'
}

const getSession = (userId) => sessions[userId];
const setSession = (userId, data) => sessions[userId] = data;
const updateSession = (userId, data) => sessions[userId] = { ...sessions[userId], ...data };
const clearSession = (userId) => delete sessions[userId];
const getUser = (userId) => users[userId];

module.exports = { getSession, setSession, updateSession, clearSession };