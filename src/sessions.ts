import { Session } from "./types/session";

const sessions: Record<string, Session> = {};

const users: Record<string, string> = {
    '240917768327370@lid': 'Pedro',
    '5364414206137@lid': 'Valesca'
}

export class Sessions {

    getSession(userId: string): Session {
        return sessions[userId]
    }

    setSession(userId: string, data: Session): void {
        sessions[userId] = data;
    }

    updateSession(userId: string, data: Partial<Session>): void {
        sessions[userId] = { ...sessions[userId], ...data };
    }

    clearSession(userId: string): void {
        delete sessions[userId];
    }

    getUserName(userId: string): string {
        return users[userId];
    }

}