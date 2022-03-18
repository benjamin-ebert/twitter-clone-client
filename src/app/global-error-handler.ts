import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { SnackbarService } from "./snackbar.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private snackbarService: SnackbarService,
  ) {}

  handleError(error: any) {
    let status = '';
    let message = '';

    if (error instanceof HttpErrorResponse) {
      if (error.status) status = error.status.toString() + ' - ';
      error.error ? message = error.error : message = error.message;
    } else {
      error = error.rejection;
      message = error.message;
    }

    this.zone.run(() =>
      this.snackbarService.openSnackBar(
        status + message,
        'OK',
        { duration: 60000 }
      )
    );

    console.error('Error from global error handler', error);
  }
}
