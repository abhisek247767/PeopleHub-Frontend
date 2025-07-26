import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');

    const darkToggle = document.getElementById('darkModeSwitch') as HTMLInputElement;
    const earthToggle = document.getElementById('earthModeSwitch') as HTMLInputElement;
    const icon = document.getElementById('modeIcon');

    // Remove existing theme classes
    document.body.classList.remove('dark-theme', 'earth-theme');

    // Apply stored theme
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (darkToggle) darkToggle.checked = true;
      if (earthToggle) earthToggle.checked = false;
      if (icon) icon.innerText = '🌙';
    } else if (theme === 'earth') {
      document.body.classList.add('earth-theme');
      if (earthToggle) earthToggle.checked = true;
      if (darkToggle) darkToggle.checked = false;
      if (icon) icon.innerText = '🌍';
    } else {
      if (darkToggle) darkToggle.checked = false;
      if (earthToggle) earthToggle.checked = false;
      if (icon) icon.innerText = '🌞';
    }
  }

  toggleDarkMode(event: any, mode: string): void {
    const isChecked = event.target.checked;
    const icon = document.getElementById('modeIcon');
    const otherToggleId = mode === 'dark' ? 'earthModeSwitch' : 'darkModeSwitch';
    const otherToggle = document.getElementById(otherToggleId) as HTMLInputElement;

    // Remove all theme classes first
    document.body.classList.remove('dark-theme', 'earth-theme');

    // Uncheck the other toggle
    if (otherToggle) {
      otherToggle.checked = false;
    }

    if (isChecked) {
      if (mode === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        if (icon) icon.innerText = '🌙';
      } else if (mode === 'earth') {
        document.body.classList.add('earth-theme');
        localStorage.setItem('theme', 'earth');
        if (icon) icon.innerText = '🌍';
      }
    } else {
      localStorage.setItem('theme', 'light');
      if (icon) icon.innerText = '🌞';
    }
  }
}
