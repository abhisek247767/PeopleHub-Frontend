export interface IApiResponse {
    message: string;
    result: boolean;
    data: any;
}

export interface IParentDept {
    name: any;
    _id: any;
    departmentId: number;
    departmentName: string;
    departmentLogo: string;
}

export interface IChildDept {
    _id: any;
    childDeptId: number;
    parentDeptId: number;
    departmentName: string;
}

export interface IUser {
    _id: string;
    username: string;
    email: string;
    role: 'superadmin' | 'admin' | 'user' | 'employee';
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IEmployee {
    _id: string;
    user_id: string;
    employeeName: string;
    contactNo: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    department: string;
    subDepartment: string;
    createdAt: string;
    updatedAt: string;
    user?: IUser; // Populated user data
}

export interface IProject {
    _id: string;
    projectName: string;
    projectDescription: string;
    deliveryManager: string;
    manager: string;
    lead: string;
    developers: string[];
    status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
    startDate?: string;
    endDate?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    budget?: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    teamSize?: number;
    // Populated user details
    deliveryManagerDetails?: IUser;
    managerDetails?: IUser;
    leadDetails?: IUser;
    developerDetails?: IUser[];
    createdByDetails?: IUser;
}

export interface IEmployeeCreateRequest {
    employeeName: string;
    contactNo: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    department: string;
    subDepartment: string;
    password: string;
    username?: string; // Optional, will be auto-generated if not provided
}

export interface IEmployeeCreateResponse {
    success: boolean;
    message: string;
    employee: IEmployee;
    userCreated: boolean;
}

