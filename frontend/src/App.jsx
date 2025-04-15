import React from 'react';
import './App.css';
import UserList from './componenets/UserList';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management System</h1>
      </header>
      <main className="app-main">
        <UserList />
      </main>
      <footer className="app-footer">
        <p>&copy; User Management System</p>
      </footer>
    </div>
  );
}

export default App;
