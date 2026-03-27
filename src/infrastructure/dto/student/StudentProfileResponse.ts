import type { SocioeconomicInformation } from "@/infrastructure/dto/student/SocioeconomicInformation";
import type { PersonalProblemsResponse } from "@/infrastructure/dto/student/PersonalProblemsResponse";
import type { FamilyGroupInformation } from "@/infrastructure/dto/student/FamilyGroupInformation";

export interface StudentProfileResponse {
    fullName: string;
    studentCode: string;
    institutionalEmail: string;
    cellphone: string;
    yearOfStudy: string;
    gender: string;
    dateOfBirth: string;
    socioeconomicInformation: SocioeconomicInformation;
    personalProblems: PersonalProblemsResponse;
    familyGroupInformation: FamilyGroupInformation;
}