import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            >
              {route.children && route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
