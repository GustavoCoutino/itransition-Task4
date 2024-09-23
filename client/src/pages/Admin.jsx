import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const API_URL = "https://itransition-task4-hk2t.onrender.com";
function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { getUsers, logout } = useContext(AuthContext);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const checkUserStatus = async () => {
    const token = localStorage.getItem("auth-token");
    try {
      const response = await axios.get(`${API_URL}/api/auth/check-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "User is blocked") {
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Error checking user status:",
        error.response?.data?.message || error.message
      );
      logout();
      navigate("/login");
    }
  };

  const fetchUsers = async () => {
    try {
      const usersResponse = await getUsers();
      setUsers(usersResponse);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      localStorage.removeItem("auth-token");
      navigate("/login");
    }
  };

  const toggleSelection = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const modifyUsers = async (url) => {
    try {
      const token = localStorage.getItem("auth-token");
      await axios.put(
        `${API_URL}/api/users/${url}`,
        { users: selectedUsers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error(
        `Failed to ${url} users:`,
        error.response?.data?.message || error.message
      );
    }
  };

  const deleteUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      await axios.delete(`${API_URL}/api/users/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { users: selectedUsers },
      });
      fetchUsers();
    } catch (error) {
      console.error(
        "Failed to delete users:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    checkUserStatus();
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={logout}
          className="bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => modifyUsers("block")}
          className="bg-gray-200 p-2 rounded-md shadow hover:bg-gray-300 flex items-center"
        >
          <span role="img" aria-label="block" className="mr-1">
            🔒
          </span>{" "}
          Block
        </button>
        <button
          onClick={() => modifyUsers("unblock")}
          className="bg-gray-200 p-2 rounded-md shadow hover:bg-gray-300 flex items-center"
        >
          <span role="img" aria-label="unblock" className="mr-1">
            🔓
          </span>{" "}
          Unblock
        </button>
        <button
          onClick={deleteUsers}
          className="bg-red-500 text-white p-2 rounded-md shadow hover:bg-red-600 flex items-center"
        >
          <span role="img" aria-label="delete" className="mr-1">
            🗑️
          </span>{" "}
          Delete
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map((user) => user.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                  checked={selectedUsers.length === users.length}
                />
              </th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Position</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Last Login</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelection(user.id)}
                  />
                </td>
                <td className="p-2">{user.name || "-"}</td>
                <td className="p-2">{user.position || "-"}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : "-"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 0
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {user.status === 0 ? "Blocked" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users available</p>
      )}
    </div>
  );
}

export default Admin;
