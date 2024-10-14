// eslint-disable-next-line no-unused-vars
import React from "react";
import UserList from "./UserList";
import AddUsers from "./AddUsers";
import UpdateUsers from "./UpdateUsers";

const UsersManager = () => {
  return (
    <>
      <UserList />
      <AddUsers />
      <UpdateUsers />
    </>
  );
};

export default UsersManager;
