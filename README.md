# Twitter Clone Client

This is the client frontend of a simplified replication of the Twitter web app.
It does not aim to be a complete or exact copy of Twitter's frontend, but tries to
resemble the most important aspects of its design, features and user experience.
[Angular Material](https://material.angular.io)'s component library and [Tailwind CSS](https://tailwindcss.com)
were used to build the UI.
The server backend is written in Go and can be found [here](https://github.com/benjamin-ebert/twitter-clone-server).

The hosted app can be found [here](https://twitter-clone.benjaminebert.net).

As of now it contains the following features:
- landing page
- registration and login using email / password
- registration and login using Github
- feed
- tweet detail view
- ability to tweet using
  - the form at the top of the feed
  - the dialog opening after clicking the tweet-button on the left sidebar
- ability to reply using
  - the form below the parent tweet inside its tweet detail view
  - the dialog opening after clicking the reply-button at the bottom of a tweet list item
- ability to like, retweet and copy a tweet's url by clicking the respective buttons in a tweet list item
- image attachments for tweets and replies
- user profile with abilities to
  - view a user's data
  - update one's own data using a stepper dialog
  - upload and update avatar and header images
  - follow and unfollow a user
  - view a user's tweets grouped by four criteria
- infinite scroll behavior in the profile tabs and home feed
- follow-suggestions of users at the bottom of the right sidebar
- user search at the top of the right sidebar
- responsive behavior, although the mobile view differs quite a bit from the original

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
