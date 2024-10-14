// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import { Button, Input } from '@material-tailwind/react'
import { Navigate } from 'react-router-dom';

const AddUsers = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New user:", userData);
    Navigate("/admin/users");
  };

  return (
    <div className="flex">
      <div className="w-3/4 px-4 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add User</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
            <Button onChange={handleChange} type="submit" color="green">
              Add User
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUsers;
