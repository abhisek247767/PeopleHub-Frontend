import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Select2Module } from 'ng-select2-component';

import { IApiResponse, IChildDept, IParentDept } from '../../model/interface/master';
import { MasterService } from './../../service/master.service';
import { EmployeeService } from '../../employee.service';
@Component({
  selector: 'app-employee',
  imports: [ Select2Module, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  isFormVisiable: boolean = false;
  parentDeptList: IParentDept[] = [];
  childDeptListById: IChildDept[] = [];
  employeeForm!: FormGroup;
  parentDeptId: number = 0;

  masterService = inject(MasterService);
  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      contactNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      parentDeptId: ['', Validators.required],
      childDeptId: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.isFormVisiable = false;
  }
  

  onParentDeptChange(){
    this.masterService.getAllChildDeptBy(this.parentDeptId).subscribe(
      (res: IApiResponse) => {
        this.childDeptListById = res.data;
      },
      (error) => {
        console.error('Error fetching child departments:', error);
      }
    )
  }
  toggleForm() {
    this.isFormVisiable = !this.isFormVisiable;
  }

  closeForm() {
    this.isFormVisiable = false;
  }
  onSubmit(): void {


    const payload = this.employeeForm.value;

    this.employeeService.addEmployee(payload).subscribe({
      next: (res) => {
        console.log('Employee Added', res);
        // reset form or show success message
      },
      error: (err) => {
        console.error('Error adding employee', err);
      },
    });
}
}
