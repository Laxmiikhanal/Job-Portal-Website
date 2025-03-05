import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser, getUser } from "../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for details
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const [role, setRole] = useState(""); // Track the role for the edit form

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (err) {
      alert("Failed to fetch users: " + err.message);
    }
  };

  // Fetch details of a single user
  const fetchUserDetails = async (id) => {
    try {
      const response = await getUser(id);
      setSelectedUser(response.user);
    } catch (err) {
      alert("Failed to fetch user details: " + err.message);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers(); // Refresh the list
      alert("User deleted successfully!");
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  // Handle edit user (open edit form)
  const handleEdit = (user) => {
    setEditingUser(user);
    setRole(user.role); // Set the initial role
  };

  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Handle form submission for updating a user's role
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, { role });
      setEditingUser(null); // Close the edit form
      fetchUsers(); // Refresh the list
      alert("User role updated successfully!");
    } catch (err) {
      alert("Failed to update user role: " + err.message);
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>

      {/* Table to display all users */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => fetchUserDetails(user.id)}
                  className="view-button"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to display user details */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>User Details</h3>
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedUser.created_at).toLocaleString()}
            </p>
            <button onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal to edit user role */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User Role</h3>
            <form onSubmit={handleUpdate}>
              <label>
                Role:
                <select value={role} onChange={handleRoleChange} required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;