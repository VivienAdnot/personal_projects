### material UI lack of compatibility with React 18
@material-ui/core is not compatible with React 18.

Hence, we have to use a trick every time we install a new npm package
For example:
```
npm install react-router-dom --legacy-peer-deps
```