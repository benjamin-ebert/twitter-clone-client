import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Observable, BehaviorSubject, map, tap, first, concatMap, switchMap} from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { StepperOrientation } from "@angular/cdk/stepper";
import { ProfileService } from "../profile.service";
import { User } from "../user";
import { select, Store } from "@ngrx/store";
import { selectUserInfo, userUpdateComplete } from "../store";
import { SnackbarService } from "../snackbar.service";
import { FormBuilder, Validators } from "@angular/forms";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  env = environment;
  authedUser$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  avatar: File|null = null;
  avatarPreview: string = '';
  @ViewChild('headerInput') headerInput!: ElementRef<HTMLInputElement>;
  header: File|null = null;
  headerPreview: string = '';
  userForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(15)]],
    handle: ['', [Validators.required, Validators.maxLength(15)]],
    bio: ['', Validators.max(160)],
  })
  userFormChanged$ = new BehaviorSubject<boolean>(false);
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    private store: Store,
    private profileService: ProfileService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    // Populate the user form with data of authedUser, then watch for changes to the form.
    // Emit a boolean, expressing whether the form has changed, to userFormChanged$.
    // userFormChanged$ determines the behavior of the submit button.
    let initialForm: User|null = null;
    this.authedUser$.pipe(
      tap(user => {
        this.userForm.patchValue(user!);
        initialForm = this.userForm.value;
      }),
      switchMap(() => this.userForm.valueChanges.pipe(
        tap(editedForm => {
          this.userFormChanged$.next(
            JSON.stringify(initialForm) !== JSON.stringify(editedForm))
        }))
      ),
    ).subscribe()
  }

  uploadUserImage(image: File, imageType: string): void {
    this.profileService.uploadUserImage(image, imageType)
      .pipe(
        first(),
        tap(updated => {
          this.store.dispatch(userUpdateComplete({ user: updated }))
          this.profileService.profileState$.next(updated)
        }),
      )
      .subscribe()
  }

  previewImage(image: FileList, imageType: string): void {
    if (this.imageValid(image.item(0)!)) {
      let reader = new FileReader();
      reader.onloadend = () => {
        let url = reader.result;
        if (typeof url === 'string') {
          if (imageType === 'avatar') {
            this.avatarPreview = url;
            this.avatar = image.item(0)!
          } else {
            this.headerPreview = url;
            this.header = image.item(0)!
          }
        } else {
          this.snackbarService.openSnackBar('There was a problem with your photo.')
        }
      }
      reader.readAsDataURL(image.item(0)!)
    }
  }

  imageValid(image: File): boolean {
    // Check file type.
    if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
      this.snackbarService.openSnackBar('Please use a .png or .jpeg photo.')
      return false;
    }
    // Check max upload size.
    if (image.size > 2000000) {
      this.snackbarService.openSnackBar('Please choose a photo smaller than 5MB.')
      return false;
    }
    return true
  }

  removeImage(imageType: string): void {
    if (imageType === 'avatar') {
      this.avatarInput!.nativeElement.value = '';
      this.avatar = null;
      this.avatarPreview = '';
    } else {
      this.headerInput!.nativeElement.value = ''
      this.header = null;
      this.headerPreview = '';
    }
  }

  updateUserData(): void {
    // Get the authed user from store and merge it with the values from userForm
    this.profileService.updateProfile({ ...this.getAuthedUser(), ...this.userForm.value })
      .pipe(
        first(),
        tap(updated => {
          this.store.dispatch(userUpdateComplete({ user: updated }))
          this.profileService.profileState$.next(updated)
        }),
      )
      .subscribe()
  }

  getAuthedUser(): User {
    let user: User|null = null
    this.authedUser$.pipe(first()).subscribe(authedUser => user = authedUser)
    return user!
  }

  close(): void {
    this.dialogRef.close();
  }
}
