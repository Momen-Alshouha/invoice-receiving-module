import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AdditionalCostService } from '../services/addtional-cost.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-additional-cost',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './additional-cost.component.html',
  styleUrls: ['./additional-cost.component.css'],
})
export class AdditionalCostComponent implements OnInit {
  @Input() itemId: number | null = 1; 
  additionalCostForm: FormGroup;
  private modalRef: NgbModalRef | null = null;
  additionalCosts: any[] = [];
  selectedCost: any | null = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private additionalCostService: AdditionalCostService
  ) {
    this.additionalCostForm = this.fb.group({
      category: [''],
      type: [''],
      description: [''],
      serviceProvider: [''],
      referenceNo: [''],
      date: [''],
      statusId: [1],
    });
  }

  ngOnInit(): void {}

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'full-screen-modal animated-bottom-to-top',
      centered: true,
    });
  }

  openCostModal(content: any, cost: any) {
    this.selectedCost = cost; 
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  addCost() {
    if (this.additionalCostForm.valid && this.itemId !== null) {
      const costData = { ...this.additionalCostForm.value, itemId: 1 };
      this.additionalCostService.addCost(costData).subscribe({
        next: (response) => {
          console.log('Cost added successfully', response);
          if (this.modalRef) {
            this.additionalCosts.push(costData);
            this.additionalCostForm.reset();
            this.modalRef.close();
          }
        },
        error: (err) => console.error('Error adding cost:', err),
      });
    }
  }
}
