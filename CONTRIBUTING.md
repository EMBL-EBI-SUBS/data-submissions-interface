# Contributing to the Data Submissions Interface

Thanks for your willingness to contribute to the project

## Setup

If you have writing permission into project's repo, then clone it locally.

```
git clone https://github.com:EMBL-EBI-SUBS/data-submissions-interface.git

or

git clone git@github.com:EMBL-EBI-SUBS/data-submissions-interface.git
```

Otherwise, fork the repo using GitHub, and submit pull requests.

Then download the dependencies.

```
npm ci
```

## Branch convention

Main development branch is `develop`. Make sure you checkout this branch. New
features should be created in sub-branches.

## Commit guidelines

All the commits should pass the `ng lint` command. Therefore, we recommend that
you set a `pre-commit` git hook in this way:

```
ln -s ../../githooks/pre-commit  .git/hooks/pre-commit
```

Additionally, to help you to adhere to the standard commit messages in the repo
we recommend the use of the following `prepare-commit-msg` git hook:

```
ln -s ../../githooks/prepare-commit-msg  .git/hooks/prepare-commit-msg
```

## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app
will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the
`dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via
[Karma](https://karma-runner.github.io) using Chrome.

## Running end-to-end tests

Run `npm e2e` to execute the end-to-end tests via
[Protractor](http://www.protractortest.org/).  Before running the tests make
sure you are serving the app via `npm start`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can
also use `ng generate directive/pipe/service/class/module`.
