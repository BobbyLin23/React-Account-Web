import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import router from './router';
import './App.css';

function App() {
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const needNav = ['/', '/data', '/user'];

  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]);

  return (
    <>
      <Routes>
        {router.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
      <div className="bottom">
        <Navbar showNav={showNav} />
      </div>
    </>
  );
}

export default App;
