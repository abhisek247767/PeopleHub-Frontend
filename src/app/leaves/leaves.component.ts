import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LeavesService } from '../leaves.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  leaveForm!: FormGroup;
  emails: string[] = [];
  casualLeave = 0;
  privilegeLeave = 0;
  sickLeave = 0;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeavesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      leaveType: ['',Validators.required],  //Add leave type in the form 
      description: ['', [Validators.required, Validators.maxLength(250)]],
      toEmail: ['', Validators.required]
    });

    this.loadLeaveBalance();
    this.loadEmails();
  }

  loadLeaveBalance() {
    this.leaveService.getLeaveBalance().subscribe({
      next: (res) => {
        this.casualLeave = res.casualLeave || 0;
        this.privilegeLeave = res.privilegeLeave || 0;
        this.sickLeave = res.sickLeave || 0;
      },
      error: () => {
        this.toastr.error('Failed to load leave balance', 'Error');
      }
    });
  }

  loadEmails() {
    this.leaveService.getEmails().subscribe({
      next: (res: any) => {
        this.emails = res.emails || [];
        console.log('Data successfully received by the component:', res);
      },
      error: () => {
        this.toastr.error('Failed to load emails', 'Error');
      }
    });
  }

  applyLeave() {
    if (this.leaveForm.invalid) {
      this.toastr.warning('Please fill all fields properly', 'Warning');
      return;
    }

    this.leaveService.applyLeave(this.leaveForm.value).pipe(
      switchMap(() => {
      this.toastr.success('Leave applied successfully', 'Success');
      this.leaveForm.reset();
      
      return this.leaveService.getLeaveBalance();
    })
  ).subscribe({
      next: (leaveBalanceResponse) => {
        console.log('Updated leave balance received:', leaveBalanceResponse);
      this.casualLeave = leaveBalanceResponse.leaves.casualLeave || 0;
      this.privilegeLeave = leaveBalanceResponse.leaves.privilegeLeave || 0;
      this.sickLeave = leaveBalanceResponse.leaves.sickLeave || 0;
      },
      error: () => {
        this.toastr.error('Failed to apply leave', 'Error');
      }
    });
  }
}
