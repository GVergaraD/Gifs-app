import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-lazy-image',
  templateUrl: './lazy-image.component.html',
  styleUrl: './lazy-image.component.css'
})
export class LazyImageComponent implements OnInit{
  ngOnInit(): void {
    if(!this.url) throw new Error('Url is required');
  }
  @Input()
  public url!: string;
  @Input()
  public alt: string = '';

  public hasLoaded: boolean = false;

  onLoad(): void {
    setTimeout(() => {
      this.hasLoaded = true;
    }, 1000);
    // this.hasLoaded = true;
  }

}
