import { useState } from 'react';
import './App.scss';
import 'bootstrap/dist/js/bootstrap.bundle';
import AdminRoutes from './pages/Admin/AdminRoutes';
import Client from './pages/Client';
function App() {
  const [statusAdmin] = useState(true);
  
  return (
    <>
      {
        statusAdmin ?
          <AdminRoutes />
          :
          <Client />
      }
    </>
  );
}

export default App;
