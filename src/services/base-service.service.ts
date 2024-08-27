import axios, { AxiosInstance } from "axios"

export interface AuthHearder {
    Authorization: string 
}

export default class BaseService<T>{
    private _request: AxiosInstance;


    constructor(private _baseUrl: string, private _path: string, private _authHearders?: AuthHearder){
        this._request = axios.create({baseURL: `${this._baseUrl}/${this._path}`});
    }

    updateAuthHeaders(authHeaders: AuthHearder): void {
        this._authHearders = authHeaders;
    }

    async get(subString?: string, params?: any): Promise<T>{
        const {data} = await this._request.get<T>(subString || '', { params: params});
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