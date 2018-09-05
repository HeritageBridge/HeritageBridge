# HeritageBridge (Frontend)
 
This is the front-end component of the HeritageBridge application. The full design spec can be found here: https://gallery.io/projects/MCHbtQVoQ2HCZe_5CoPFrW-T/files/MCEZJgrrrKGU-JLocY7bNUdW.

![](https://lh3.googleusercontent.com/GevI15RHbVvYCNxIjNfqssrO16k4RDXoGREizkCKA5WKxZgcWwC2EmTLqld6j4YQ5WtEDQJzc2lIF4c0eMSQsQdIAWD2xFun47E=d)

## React

The UI is implemented using [React](https://reactjs.org/) and is served up by the django frontend application. This is done using a template that loads the React components compiled into javascript and css via webpack. These compiled resources are placed in the `static/frontend` folder within this directory. 

## Installing Dependencies

Be sure to install the required javascript dependencies by going into the frontend folder (the `package.json` will be located in it) and running: 
```
npm install
```

## Building

Once the dependencies are installed you can compile the React components into a `main.js` file that the `index.html` template will look for by running: 
```
npm run build
```

The resulting `main.js` file will be located in the `static/frontend` folder of this directory. 

## Hot Reloading

In development you may want to have webpack recompile the `main.js` file anytime you make a change to a React component. The `App` component has been configured to hot reload in a development environment so start by running:
```
npm run dev
```

This will start a webpack process that will recompile the `main.js` file anytime you modify a React component used within the `App` component (which should be everything). 
