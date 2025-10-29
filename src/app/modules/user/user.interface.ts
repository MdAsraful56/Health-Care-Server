export interface createPatientInput {
    name: string;
    email: string;
    password: string;
}

export interface createDocterInput {
    name: string;
    email: string;
    password: string;
    gender: Gender;
}

export interface createAdminInput {
    name: string;
    email: string;
    password: string;
    contactNumber: string;
}

export enum Gender {
    MALE,
    FEMALE,
}
