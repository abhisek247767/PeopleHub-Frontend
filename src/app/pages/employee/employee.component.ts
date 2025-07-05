import { FormsModule } from '@angular/forms';
import { Select2Module } from 'ng-select2-component';
import { IApiResponse, IChildDept, IParentDept } from '../../model/interface/master';
import { MasterService } from './../../service/master.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  imports: [FormsModule,Select2Module,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {


  isFormVisiable: boolean = false;
  masterService = inject(MasterService)
  parentDeptList: IParentDept[] = []
  childDeptListById: IChildDept[] = []
  parentDeptId: number = 0;

  ngOnInit(): void {
    this.getParentDept()
  }


  getParentDept() {
    this.masterService.getAllDept().subscribe(
      (res: IApiResponse) => {
        this.parentDeptList = res.data;  
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
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

}
