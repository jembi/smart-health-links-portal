import { BaseModel } from "./base-model";
import z from 'zod';

export class ShlinkModel extends BaseModel{
    
    constructor(private userId: string, 
        private passcodeFailuresRemaining: number, 
        private configPasscode: string, 
        private configExp: Date, 
        private active: boolean, 
        private managementToken: string, 
        private id?: string){
        super(z.object({
            userId: z.string().min(10),
            passcodeFailuresRemaining: z.number().min(5),
            configPasscode: z.string().min(4),
            configExp: z.date(),
            active: z.boolean(),
            managementToken: z.string().min(10),
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

    getPasscodeFailuresRemaining(): number {
        return this.passcodeFailuresRemaining;
    }

    setPasscodeFailuresRemaining(passcodeFailuresRemaining: number): void {
        this.passcodeFailuresRemaining  = passcodeFailuresRemaining
    }

    getConfigPasscode(): string {
        return this.configPasscode;
    }

    setConfigPasscode(configPasscode: string): void {
        this.configPasscode  = configPasscode
    }

    getConfigExp(): Date {
        return this.configExp;
    }

    setConfigExp(configExp: Date): void {
        this.configExp  = configExp
    }

    getActive(): boolean {
        return this.active;
    }

    setActive(active: boolean): void {
        this.active  = active
    }

    getManagementToken(): string {
        return this.managementToken;
    }

    setManagementToken(managementToken: string): void {
        this.managementToken  = managementToken
    }

    getUserId(): string {
        return this.userId;
    }

    setUserId(userId: string): void {
        this.userId  = userId
    }
}