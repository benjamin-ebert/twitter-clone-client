import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string = 'OK') {
    this.snackBar.open(message, action);
  }
}
