interface AuthCredentials {
    email: string;
    password: string;
}
interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}
interface AuthUser {
    id: string;
    address: string;
}
interface AuthSession {
    user: AuthUser;
    token: AuthToken;
}
interface PollarClientConfig {
    baseUrl: string;
    apiKey: string;
}
interface AuthError {
    code: string;
    message: string;
}
type LoginOptions = {
    provider: 'google';
} | {
    provider: 'github';
} | {
    provider: 'email';
    email: string;
};

declare class PollarClient {
    readonly config: PollarClientConfig;
    readonly id: string;
    readonly basePath: string;
    private _session;
    private _listeners;
    constructor(config: PollarClientConfig);
    getSession(): AuthSession | null;
    onSessionChange(cb: (session: AuthSession | null) => void): () => void;
    logout(): Promise<void>;
    login(options: LoginOptions): Promise<void>;
    private _readStorage;
    private _isValidSession;
    private _storeSession;
    private _clearSession;
    private _notify;
    private _fetch;
}

declare function login(_client: PollarClient, _credentials: AuthCredentials): Promise<AuthSession>;

declare function logout(_client: PollarClient): Promise<void>;

declare function refreshToken(_client: PollarClient, _token: string): Promise<AuthToken>;
declare function getSession(_client: PollarClient): AuthSession | null;

export { type AuthCredentials, type AuthError, type AuthSession, type AuthToken, type AuthUser, type LoginOptions, PollarClient, type PollarClientConfig, getSession, login, logout, refreshToken };
