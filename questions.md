# Frontend test - Part 2

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

The difference is in their default re-rendering behavior. While a `Component` re-renders whenever its parent re-renders, a `PureComponent` does a shallow comparison of its current and next props and state. If these are the same, a re-render is skipped.

So a `PureComponent` won't re-render when its parent re-renders if its new props and state are the same with the old ones, offering a performance optimization.

**Example of breaking the app**:
Failing to re-render

`PureComponent` fails to re-render when objects or arrays are mutated directly, since it performs only a shallow comparison. So if a prop is mutated, `PureComponent` will not realize that the prop changed and will not re-render when it actually should.
Following example shows that:

```
const MyPureComponent = ({ data }) => {
  return <div>{data.join(',')}</div>;
};

const App = () => {
  const data = [1, 2, 3];

  // This won't trigger a re-render in MyPureComponent
  // because the array reference remains the same after mutation
  data.push(4);

  return <MyPureComponent data={data} />;
};
```

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

`Context` enables the passing of data to components deep in the component tree without needing intermediate components to know about it.

`ShouldComponentUpdate` checks if there are meaningful changes in the data (props or state) before allowing the component and its children to be re-rendered. If the changes are not important it skips the re-rendering.

The combination of `Context` and `shouldComponentUpdate` might be dangerous. Since `shouldComponentUpdate` relies on shallow comparisons, changes in `context` values may not trigger a re-render if the reference to the `context` object remains the same. Incorrect usage might introduce bugs, leading to components not updating when they should or updating unnecessarily.

(To mitigate this issue, avoiding direct mutation of context values is advised, so changes in the context object are more accurately detected, preventing unexpected behavior)

## 3. Describe 3 ways to pass information from a component to its PARENT.

1. Callback Functions: The parent creates a callback function, passes it as a prop to the child and the child calls this function to pass data back to the parent.

2. Function Props: The parent directly passes a function as a prop to the child, allowing the child to use the function to send data or trigger actions in the parent.

3. Context API: In more complex applications, the React Context API can be used to pass data from child to parent.

## 4. Give 2 ways to prevent components from re-rendering.

- For class components: Using `PureComponent` which performs a shallow comparison of props and state before deciding to re-render

- For functional components: Wrapping the component with `React.memo` to memoize it and prevent re-renders when props don't change.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

A fragment is a feature that allows grouping multiple elements without adding an additional parent element to the DOM.

We need fragments for:

- avoiding unnecessary DOM elements (like extra `<div>`)
- keeping cleaner JSX syntax
- making the app slightly faster and reduce memory usage (no need to create an extra DOM node)
- ensuring DOM inspector is less cluttered

**Example of breaking the app**: Styling Implications

If the application relies on specific CSS selectors or styles that depend on a particular DOM structure, use of fragments might be risky.
Check this code example:

```
/* App.css */
.parent-container div {
  color: red;
}

// App.js
import React from 'react';
import './App.css';

const App = () => {
  return (
    <>
      <div className="parent-container">
        <div>Child 1</div>
        <div>Child 2</div>
      </div>
    </>
  );
};

export default App;
```

By using a fragment, an extra wrapper around child `div` elements is added. In this example CSS selectors assume a specific parent-child relationship within `parent-container` and by using fragments styling may be disrupted, causing unintended issues.

## 6. Give 3 examples of the HOC pattern.

Higher Order Components (HOCs) are functions used to modify or enhance the behavior of components. Here are three examples of the HOC pattern:

- Styling and Theming: Use a HOC to apply styles from a design system or theme, making it easy for components to access and incorporate these styles.
  Example:

```
const withStyles = (Component) => (props) => (
  <Component style={{ padding: '10px' }} {...props} />
);

const EnhancedButton = withStyles(Button);

```

- Authentication: Use a HOC for specific components or routes to ensure consistent authentication throughout the application.
  Example:

```
const withAuthentication = (WrappedComponent) => (props) => (
  isAuthenticated() ? <WrappedComponent {...props} /> : <LoginPrompt />
);

const AuthenticatedComponent = withAuthentication(MyComponent);

```

- Logging: Use a HOC for applying consistent logging across a chosen group of components

Example:

```
function withLogger(Component) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`${Component.name} mounted`);
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}

class MyComponent extends React.Component {
  render() {
    return <div>Class Component</div>;
  }
}

const LoggedComponent = withLogger(MyComponent);


```

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

- Promises use `.then()` for success and `.catch`() for errors. If an exception happens, the nearest `.catch()` handles the error, skipping the rest of the chain.

```
somePromise()
  .then(result => {
    // Handle success
  })
  .catch(error => {
    // Handle error
  });

```

- Callbacks use the error-first pattern, where the first parameter is reserved for an error object. If there's no error the object is null. Otherwise, it contains error information. This parameter is checked to handle errors effectively, like the example below:

```
function asyncOperation(callback) {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      // error condition - error info in error object
      callback(new Error("An error occurred"), null);
    } else {
        setTimeout(() => {
          // successful result - error object is null
          callback(null, "Operation completed successfully");
        }, 1000);
    }
}

asyncOperation((error, result) => {
  if (error) {
    // Handle error
    console.error("Error:", error.message);
  } else {
    // Handle result
    console.log("Result:", result);
  }
});
```

- async...await uses the `try...catch` block to handle errors.

```
async function myAsyncFunction() {
  try {
    const result = await doSomethingAsync();
    // handle success
  } catch (error) {
    // handle error
  }
}
```

## 8. How many arguments does setState take and why is it async.

`setState` function takes two arguments. The first argument can be an object or a function and the second argument is an optional callback function.

- When the first argument is an object, you can just pass this object. Example:

```
this.setState({ key: 'new value' });
```

- When the first argument is a function, it receives the previous state and props as arguments and returns an object that represents the new state. Example:

```
this.setState((prevState, props) => ({
  key: prevState.key + 1,
}));
```

- Callback Function (Optional): The second argument is an optional callback function that is executed after the state is updated. Example:

```
this.setState({ key: 'new value' }, () => {
  console.log('State updated!');
});
```

**Why setState is async?**

`setState` is asynchronous to optimize performance. It batches state updates, preventing immediate re-renders after each call. This improves efficiency by avoiding unnecessary rendering cycles and ensuring consistent behavior.

## 9. List the steps needed to migrate a Class to Function Component.

- Change the class component definition to a function component.

- Remove the constructor method if present.

- Use the `useState` hook to initialize and manage state variables.

- Declare functions using `const` where applicable.

- Directly use state and props without the `this` keyword.

- Use the `useState` hook's setter function for state updates, especially when the new state depends on the previous state.

- Replace the `render` method by returning JSX directly from the function component.

- Use the `useEffect` hook for lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).

- Replace class refs with the `useRef` hook.

Note: This is a basic overview and the actual migration might involve additional considerations based on the complexity of the class component. Considerations may include for instance, using specific hooks depending on the component's structure and functionality.

## 10. List a few ways styles can be used with components.

- Inline styles: apply styles directly within JSX using the `style` attribute
  Example:

```
const MyComponent = () => {
  return <div style={color: 'blue'}>Hello world</div>;
};
```

- CSS classes: apply styles using traditional CSS classes, by using the `className` attribute.
  Example:

```
import './Button.css';

const MyButton = () => {
  return <div className="Button" />;
};
```

- CSS modules: apply styles using CSS Modules for local scoping of styles.
  Example:

```
/* PageNav.module.css */

.nav {
  display: flex;
  justify-content: space-between;
}

// PageNav.js
...
import styles from './PageNav.module.css';

const PageNav = () => {
  return (
    <nav className={styles.nav}>
      {/* Content */}
    </nav>
  );
};

...
```

## 11. How to render an HTML string coming from the server.

To render an HTML string coming from the server in a React component, `dangerouslySetInnerHTML` prop is used.

Example:

```
<div dangerouslySetInnerHTML={{__html: '<strong>strong text</strong>'}} />
```

However, setting HTML from code is risky because it’s easy to expose users to a cross-site scripting (XSS) attack. We need to always ensure that the rendered HTML is trusted and sanitized before using it in the application.
