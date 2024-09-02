import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"

export interface AuthHeader {
    accessToken: string 
}

export default class BaseService{
    protected _request: AxiosInstance;


    constructor(private _baseUrl: string, private _path: string, private _authHeaders?: AuthHeader){
        this._request = axios.create({baseURL: `${this._baseUrl}/${this._path}`});
        this.updateInterceptor();
    }

    private updateInterceptor(){
        if(this._authHeaders){
            this._request.interceptors.request.use(
                async (config: InternalAxiosRequestConfig) => {
            
                    if (config.headers) {
                    config.headers['authorization'] = `Bearer ${this._authHeaders.accessToken}`;
                    }
            
                    return config;
                }
            )
        }
    }

    updateAuthHeaders(authHeaders: AuthHeader): void {
        this._authHeaders = authHeaders;
        this.updateInterceptor();
    }

    async get<T>(subString?: string, params?: any): Promise<T>{
        const {data} = await this._request.get<T>(`/${subString || ''}`, { params: params});
        return data;
    }

    async patch<T>(subString: string | number, objData: T): Promise<T> {
        const {data} = await this._request.patch<T>(`/${subString}`, objData);
        return data;
    }

    async post<T>(reqData: T, subString?: string): Promise<T> {
        const {data} = await this._request.post<T>(subString || '', reqData);
        return data;
    }

    async delete<T>(subString: string): Promise<T> {
        const {data} = await this._request.delete<T>(subString);
        return data;
    }
}