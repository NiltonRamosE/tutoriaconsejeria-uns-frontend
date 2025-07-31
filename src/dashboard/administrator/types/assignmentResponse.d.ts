interface AssignmentResponse {
    academicAssignmentId: number;
    studentId: number;
    instructorId: number;
    studentName: string;
    name: string;
    instructorName: string;
    studentInstitutionalEmail: string;
    instructorInstitutionalEmail: string;
    studentCode: string;
    typeActivity: string;
}

export default AssignmentResponse;