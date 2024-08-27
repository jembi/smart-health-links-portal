export interface IAuthorization {
    getAccessToken(endpoint: string, clientId?: string, clientSecret?: string, username?: string, password?: string): Promise<unknown>;
}