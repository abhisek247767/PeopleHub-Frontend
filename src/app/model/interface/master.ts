export interface IApiResponse {
    message: string;
    result: boolean;
    data: any;
}

export interface IParentDept {
    departmentId: number;
    departmentName: string;
    departmentLogo: string;
}

export interface IChildDept {
    childDeptId: number;
    parentDeptId: number;
    departmentName: string;
}

