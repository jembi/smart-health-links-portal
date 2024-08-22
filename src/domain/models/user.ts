export class UserModel{
    
    constructor(private userId: string, private patientId: string, private id?: string){}

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