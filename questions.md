# Frontend test - Part 2

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

A Component re-renders whenever its parent re-renders, a PureComponent though does a shallow comparison of its current and next props and state. If these are the same, a re-render is skipped.

So the difference is that a PureComponent will re-render only if it detects a difference between the old state and props with the new ones, offering a performance optimization.

**Example of breaking the app**:
PureComponent fails to re-render when objects or arrays are mutated directly, since it performs only a shallow comparison. So if a prop is mutated, PureComponent will not realize that the prop changed and will not re-render when it actually should.
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

The combination of context and ShouldComponentUpdate might be dangerous.
When we use ShouldComponentUpdate to selectively re-render a part of the app, it can potentially block context propagation. As a result, states that should be updated with context may not receive the necessary updates.

## 3. Describe 3 ways to pass information from a component to its PARENT.

1. Callback Functions: The parent creates a callback function, passes it as a prop to the child and the child calls this function to pass data back to the parent.

2. useRef Hook: The parent passes a useRef object as a prop to the child. The child can update the current property of the useRef object, allowing data to be communicated to the parent without triggering a re-render.

3. Context API: In more complex applications, the React Context API can be used to pass data from child to parent.

## 4. Give 2 ways to prevent components from re-rendering.

- Utilize useCallback or useMemo in functional components: useCallback memorizes functions and useMemo memorizes values, preventing re-renders if they remain unchanged.

- Using useRef, we can store a value that doesn't cause extra re-renders when it changes.

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

- Callbacks' first parameter is for an error object. It's null if there's no error and contains error information if there is. We check this parameter to handle errors effectively, as in the example below:

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

The setState method in React takes two arguments. The first argument can be either an object or a function. If it's an object, it represents the new state, if it's a function it receives the previous state and props as arguments and should return an object representing the new state. The second argument is an optional callback function that is called after the state is updated.

```
this.setState({ key: 'new value' }, () => {
  console.log('State updated!');
});
```

**Why setState is async?**

setState is asynchronous in order to ensure that the app state is updated efficiently, allowing for improved performance and avoiding unnecessary rendering cycles.

## 9. List the steps needed to migrate a Class to Function Component.

- Set the class component declaration to a function declaration
- Remove the constructor method if present.
- Convert state variables in useState hooks
- Directly use state and props without the `this` keyword.
- Replace the `render` method by returning JSX directly from the function component.
- Use the `useEffect` hook for lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).
- Replace class refs with the `useRef` hook.

Note: The provided steps offer a basic overview of migrating a Class to a Function Component. Actual migration may require additional considerations based on the component's complexity, such as the use of specific hooks tailored to its structure and functionality.

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

(note: it should be used with caution to prevent cross-site scripting (XSS) vulnerabilities.)
