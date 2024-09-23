import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, status, lastLogin, position } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await req.db.query(
      "INSERT INTO users (name, email, password, status, lastLogin, position) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, status, lastLogin, position]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      message: "This email has already been used",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await req.db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user || user.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user[0].status) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await req.db.query("UPDATE users SET lastLogin = NOW() WHERE id = ?", [
      user[0].id,
    ]);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        status: user[0].status,
        position: user[0].position,
        lastLogin: user[0].lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await req.db.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user[0].status) {
      return res.status(403).json({ message: "User is blocked" });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const checkUserStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await req.db.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].status === 0) {
      return res.status(403).json({ message: "User is blocked" });
    }

    res.status(200).json({ message: "User is active", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
