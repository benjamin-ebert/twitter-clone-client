import { Component, Input } from '@angular/core';
import { Tweet } from "../tweet";

@Component({
  selector: 'app-tweet[tweet]',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  @Input() tweet!: Tweet

  constructor() { }

  ngOnInit(): void {
  }

}
