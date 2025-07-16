# sample-component-library
A library with sample components that can be used to develop the layout. 

Link to [storybook](https://vishalpalaniappan.github.io/sample-component-library/).

## Developing
Install Libraries:
```
npm i
```

Run Storybook:
```
npm run storybook
```

Build Storybook:
```
npm run build-storybook
```

Build the library:
```
npm run build
```

## Developing Locally Using Storybook

The configuration needed for developing the application locally using storybook has already been added. Run `npm run storybook` to start the server and update the relevant components and stories to see the changes in the UI.

## Developing Locally Using `npm link`
To test the library locally by importing it into another react application, use the following steps:

- run `npm link` in the component library folder. 
- run `npm link ui-layout-manager` in the local application which will import the library 
- You should now be able to import the component into the local application
- run `npm run build` in the component library to push the changes to the local application
