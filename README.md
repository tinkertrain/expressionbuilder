Q-Sensei’s Front End Starter Kit
==============================

Brought to you by a lazy programmer

## What we want in most projects

- Use ES6
- Unit Tests
- Bundle
- CSS: Sass, autoprefix
- Compile JSX
- Debug: sourcemaps
- Lint code
- Editor Config

## The stack

- CSS, Bundling, ES6, JSX, debug:
    + Webpack (loaders: babel, sass)
- Testing:
    + Runner: Karma
    + Frameworks: Jasmine 2, Sinon, Istanbul
    + Rewire for easier module dependency mocking
- Lint code: ESLint, babel-eslint

## Usage

1. Make sure you have Node and npm
2. `npm install karma-cli -g`
3. Clone this repository
4. `cd` into the directory
5. `npm install`

### Options

- For development: `npm start` visit http://0.0.0.0:8080
- Build: `npm run build` and look for the folder 'build'
- Test: `npm run test` runs Karma and under the folder 'coverage' you'll find the code coverage reports
- Clean: `npm run clean` removes the contents of the 'build' folder

### React apps

- The kit comes ready for React app development, go into the webpack configuration and set the variable `usingReact` to true.
