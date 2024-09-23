export const getAllUsers = async (req, res) => {
  try {
    const [users] = await req.db.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const blockUsers = async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    for (const id of users) {
      await req.db.query("UPDATE users SET status = 0 WHERE id = ?", [id]);
    }

    res.status(200).json({ message: "Users blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const unblockUsers = async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    for (const id of users) {
      await req.db.query("UPDATE users SET status = 1 WHERE id = ?", [id]);
    }

    res.status(200).json({ message: "Users unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUsers = async (req, res) => {
  const { users } = req.body;
  if (!Array.isArray(users)) {
    return res.status(400).json({ message: "Invalid data format" });
  }
  try {
    for (const id of users) {
      await req.db.query("DELETE FROM users WHERE id = ?", [id]);
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
