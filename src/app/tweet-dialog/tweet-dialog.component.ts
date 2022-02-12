import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-tweet-dialog',
  templateUrl: './tweet-dialog.component.html',
  styleUrls: ['./tweet-dialog.component.scss']
})
export class TweetDialogComponent {

  constructor(private dialogRef: MatDialogRef<TweetDialogComponent>) { }

  close(): void {
    this.dialogRef.close();
  }

}
