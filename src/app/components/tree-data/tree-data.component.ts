import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tree-data',
  imports: [],
  standalone: true,
  templateUrl: './tree-data.component.html',
  styleUrl: './tree-data.component.css'
})
export class TreeDataComponent {
  @Input() treeData: any;
}
