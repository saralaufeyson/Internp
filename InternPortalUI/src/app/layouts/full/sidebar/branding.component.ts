import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <img
        src="./assets/images/logos/dark-logo.svg"
        class="align-middle m-2 img-responsive"
        alt="logo"
      />
    </div>
  `,
  styles: [`
    .branding {
      width: 100%;
    }
    .img-responsive {
      max-width: 100%;
      height: auto;
    }
  `]
})
export class BrandingComponent {
  constructor() {}
}
