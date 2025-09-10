import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
import { Component, OnInit } from '@angular/core';

export class AppComponent implements OnInit {
  title = 'employee';

  ngOnInit() {
    console.log('AppComponent initialized');
  }
}
