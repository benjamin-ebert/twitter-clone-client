import {Component, Inject, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {Tweet} from "../tweet";

@Component({
  selector: 'app-tweet-dialog',
  templateUrl: './tweet-dialog.component.html',
  styleUrls: ['./tweet-dialog.component.scss']
})
export class TweetDialogComponent {
  repliesTo: Tweet | null = null;

  constructor(
    private dialogRef: MatDialogRef<TweetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { repliesTo: Tweet } | null
  ) {
    if (data && data.repliesTo) this.repliesTo = data.repliesTo;
  }

  close(tweet: Tweet | null): void {
    this.dialogRef.close(tweet);
  }

}
