import { BaseModel } from "./base-model";
import z from 'zod';

const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
const urlErrorMessage = 'Invalid URL. URL must start with http:// or https://';

export class ServerConfigModel extends BaseModel{
    
    constructor(private configKey: string, private endpointUrl: string, private ClientId?: string,
                private clientSecret?: string, private tokenEndpoint?: string, private refreshTime?: Date,
                private id?: string, private accessTokenResponse?: string, private refreshToken?: string){
        super(z.object({
            configKey: z.string().optional(),
            endpointUrl: z.string().regex(urlRegex, urlErrorMessage),
            id: z.string().optional(),
            ClientId: z.string().optional(),
            clientSecret: z.string().optional(),
            tokenEndpoint: z.string().regex(urlRegex, urlErrorMessage).optional(),
            refreshTime: z.date().optional(),
            accessTokenResponse: z.string().optional(),
            refreshToken: z.string().optional()
        }));
        this.validate();
    }

    getRefreshToken(): string | undefined {
        return this.refreshToken;
    }

    setRefreshToken(refreshToken: string): void {
        this.refreshToken = refreshToken;
    }

    getRefreshTime(): Date | undefined {
        return this.refreshTime;
    }

    setRefreshTime(refreshTime: Date): void {
        this.refreshTime = refreshTime;
    }

    getConfigKey(): string | undefined {
        return this.configKey;
    }

    setConfigKey(configKey: string) {
        this.configKey = configKey;
    }

    getAccessTokenResponse(): string | undefined {
        return this.accessTokenResponse;
    }

    setAccessTokenResponse(accessTokenResponse: string): void {
        this.accessTokenResponse = accessTokenResponse;
    }

    getEndpointUrl(): string {
        return this.endpointUrl;
    }

    setEndpointUrl(endpointUrl: string): void {
        this.endpointUrl = endpointUrl;
    }

    getId(): string | undefined{
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getClientId(): string | undefined {
        return this.ClientId;
    }

    getClientSecret(): string | undefined {
        return this.clientSecret;
    }

    setClientId(clientId: string): void {
        this.ClientId  = clientId
    }

    getTokenEndpoint(): string | undefined {
        return this.tokenEndpoint;
    }

    setTokenEndpoint(tokenEndpoint: string): void {
        this.tokenEndpoint = tokenEndpoint;
    }
}