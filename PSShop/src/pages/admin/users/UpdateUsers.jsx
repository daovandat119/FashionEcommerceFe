import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Checkbox } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Table } from "react-bootstrap";

const UpdateUser = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "User" },
    { id: 3, name: "Moderator" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (roleName) => {
    setUserData((prevData) => ({
      ...prevData,
      role: roleName,
    }));
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated user:", userData);
  };

  return (
    <div className="flex">
      <div className="w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update User</h1>
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
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="w-full px-2.5 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => setIsOpen(!isOpen)}
              >
                {userData.role || "Select Role"}
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 absolute right-2 top-1/2 transform -translate-y-1/2" />
              </button>
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  <ul className="py-1 overflow-auto text-base max-h-60">
                    {roles.map((role) => (
                      <li
                        key={role.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleRoleSelect(role.name)}
                      >
                        {role.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button type="submit" color="green">
              Update User
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
