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

export interface IEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface IProject {
  name: string;
  deliveryManager: string;
  firstManager: string;
  teamLead: string;
  developers: string[];
}

