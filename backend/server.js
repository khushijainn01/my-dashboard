// import adminRoutes from "./src/routes/admin.routes";
console.log("KHUSHI SERVER RUNNING");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/admins", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }
    await prisma.activityLog.create({
  data: {
    action: "LOGIN",
    details: `${user.email} logged in`,
  },
});

    res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


app.post("/api/admins", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      role,
      password,
      status,
    } = req.body;

    const admin = await prisma.admin.create({
      data: {
        fullName,
        email,
        phoneNumber,
        role,
        password,
        status,
      },
    });

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/admins", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/users", async (req, res) => {
    
  console.log("USERS API HIT");

  try {
    const users = await prisma.user.findMany();

    console.log("Users:", users);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("PRISMA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/activity-logs", async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/users", async (req, res) => {
    console.log("POST /api/users HIT");
  console.log(req.body);
  console.log("BODY:", req.body);

  try {
    const { name, email, role } = req.body || {};

if (!name || !email || !role) {
  return res.status(400).json({
    success: false,
    message: "Name, Email and Role are required",
  });
}

    const user = await prisma.user.create({
  data: {
    name,
    email,
    password: "123456",
    role,
  },
});

await prisma.notification.create({
  data: {
    title: "New User Registered",
    message: `${name} joined the platform.`,
    type: "User",
  },
});

await prisma.activityLog.create({
  data: {
    action: "CREATE_USER",
    details: `${name} was created`,
  },
});

res.json({
  success: true,
  data: user,
});
  } catch (error) {
  console.error(error);

  if (error.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

const user = await prisma.user.findUnique({
  where: {
    id,
  },
});

await prisma.user.delete({
  where: {
    id,
  },
});

await prisma.notification.create({
  data: {
    title: "User Deleted",
    message: `${user.name} was removed from the system.`,
    type: "User",
  },
});

await prisma.activityLog.create({
  data: {
    action: "DELETE_USER",
    details: `${user.name} was deleted`,
  },
});

    res.json({
      success: true,
      message: "User Deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/api/users/:id", async (req, res) => {
  console.log("PUT HIT");
  console.log("ID:", req.params.id);
  console.log("BODY:", req.body);

  try {
    const id = Number(req.params.id);
    const { name, email, role } = req.body;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        role,
      },
    });

    await prisma.notification.create({
  data: {
    title: "User Updated",
    message: `${name}'s profile was updated.`,
    type: "User",
  },
});

await prisma.activityLog.create({
  data: {
    action: "UPDATE_USER",
    details: `${name} was updated`,
  },
});

console.log("UPDATED USER:", user);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("PUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/notifications", async (req, res) => {
  console.log("BODY:", req.body)
  try {
    const { title, message } = req.body || {};

if (!title || !message) {
  return res.status(400).json({
    success: false,
    message: "Title and Message are required",
  });
}

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
      },
    });

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/test", (req, res) => {
  console.log("TEST HIT");
  res.send("TEST WORKING");
});

app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const notifications = await prisma.notification.count();

    const activityLogs = await prisma.activityLog.count();

    res.json({
      success: true,
      data: {
        totalUsers,
        notifications,
        activityLogs,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/user-role-stats", async (req, res) => {
  try {
    const roleStats = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    res.json({
      success: true,
      data: roleStats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/activity-chart", async (req, res) => {
  try {
    const logs = await prisma.activityLog.groupBy({
      by: ["action"],
      _count: {
        action: true,
      },
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/user-growth", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const growth = {};

    users.forEach((user) => {
      const date = new Date(user.createdAt).toLocaleDateString();

      growth[date] = (growth[date] || 0) + 1;
    });

    const result = Object.entries(growth).map(([date, count]) => ({
      date,
      count,
    }));

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/change-password", async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await prisma.user.findFirst();

    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "PASSWORD_CHANGED",
        details: "Password updated successfully",
      },
    });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/security-stats", async (req, res) => {
  try {
    const latestLog = await prisma.activityLog.findFirst({
      where: {
        action: "LOGIN",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: {
        lastLogin: latestLog?.createdAt || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/two-factor-status", async (req, res) => {
  try {
    const user = await prisma.user.findFirst();

    res.json({
      success: true,
      data: {
        enabled: user?.twoFactorEnabled || false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/two-factor-toggle", async (req, res) => {
  try {
    const user = await prisma.user.findFirst();

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorEnabled: !user.twoFactorEnabled,
      },
    });

    res.json({
      success: true,
      data: {
        enabled: updatedUser.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error("2FA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const user = await prisma.user.findFirst()

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

app.post("/api/profile", async (req, res) => {
  try {
    const { name, email } = req.body

    const user = await prisma.user.findFirst()

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
      },
    })

    await prisma.activityLog.create({
      data: {
        action: "PROFILE_UPDATED",
        details: `${updatedUser.email} updated profile`,
      },
    })

    res.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

console.log(__filename);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});