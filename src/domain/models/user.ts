import { BaseModel } from "./base-model";
import z from 'zod';

export class UserModel extends BaseModel{
    
    constructor(private userId: string, private patientId: string, private id?: string){
        super(z.object({
            userId: z.string().min(1),
            patientId: z.string().min(1),
            id: z.string().optional()
        }));
        this.validate();
    }

    getId(): string | undefined{
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getPatientId(): string {
        return this.patientId;
    }

    getUserId(): string {
        return this.userId;
    }

    setUserId(userId: string): void {
        this.userId  = userId
    }
}