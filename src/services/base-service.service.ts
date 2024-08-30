import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"

export interface AuthHearder {
    accessToken: string 
}

export default class BaseService<T>{
    protected _request: AxiosInstance;


    constructor(private _baseUrl: string, private _path: string, private _authHearders?: AuthHearder){
        this._request = axios.create({baseURL: `${this._baseUrl}/${this._path}`});
        this.updateInterceptor();
    }

    private updateInterceptor(){
        if(this._authHearders){
            this._request.interceptors.request.use(
                async (config: InternalAxiosRequestConfig) => {
            
                    if (config.headers) {
                    config.headers['authorization'] = `Bearer ${this._authHearders.accessToken}`;
                    }
            
                    return config;
                }
            )
        }
    }

    updateAuthHeaders(authHeaders: AuthHearder): void {
        this._authHearders = authHeaders;
        this.updateInterceptor();
    }

    async get(subString?: string, params?: any): Promise<T>{
        const {data} = await this._request.get<T>(`/${subString || ''}`, { params: params});
        return data;
    }

    async patch(subString: string | number, objData: T): Promise<T> {
        const {data} = await this._request.patch<T>(`/${subString}`, objData);
        return data;
    }

    async post(reqData: T, subString?: string): Promise<T> {
        const {data} = await this._request.post<T>(subString || '', reqData);
        return data;
    }

    async delete(subString: string): Promise<T> {
        const {data} = await this._request.delete<T>(subString);
        return data;
    }
}