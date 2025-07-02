const cors = require("cors");
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const OpenAI = require("openai");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize("llu", "root", "AndroidStudio5522", {
    host: "localhost",
    dialect: "mysql",
});


const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(45), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false },
}, {
    freezeTableName: true
});

const Timer = sequelize.define("Timer", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    timeIntervals: { type: DataTypes.TEXT, allowNull: false },
    quality: { type: DataTypes.TINYINT, allowNull: true },
    isCompleted: { type: DataTypes.CHAR, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Stopwatch = sequelize.define("Stopwatch", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    timeIntervals: { type: DataTypes.TEXT, allowNull: false },
    quality: { type: DataTypes.TINYINT, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Emotions = sequelize.define("Emotions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    emotions: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Flashcard = sequelize.define("Flashcard", {
    jar: DataTypes.STRING,
    category: DataTypes.STRING,
    lastReviewedAt: DataTypes.DATE,
    data: DataTypes.JSON,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
});

User.hasMany(Timer, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Stopwatch, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Emotions, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Flashcard, { foreignKey: "user_id", onDelete: "CASCADE" });
Flashcard.belongsTo(User, { foreignKey: "user_id" });
Timer.belongsTo(User, { foreignKey: "user_id" });
Stopwatch.belongsTo(User, { foreignKey: "user_id" });
Emotions.belongsTo(User, { foreignKey: "user_id" });

sequelize
    .sync({ alter: true })
    .then(() => console.log("Database & tables created!"))
    .catch((err) => console.error("Error creating database:", err));


const app = express();
const PORT = 3001;

app.use(cors()); 
app.use(express.json());

// app.post("/api/users", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const newUser = await User.create({ email, password });
//         res.status(201).json(newUser);
//     } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({ error: "Failed to create user" });
//     }
// });

// app.post("/api/user", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const newUser = await User.create({ email, password });
//         res.status(201).json(newUser);
//     } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({ error: "Failed to create user" });
//     }
// });

app.post("/api/timers", async (req, res) => {
    try {
        const { timeIntervals, user_id, quality, isCompleted } = req.body;
        const newTimer = await Timer.create({ timeIntervals, user_id, quality, isCompleted });
        res.status(201).json(newTimer);
    } catch (error) {
        console.error("Error creating timer:", error);
        res.status(500).json({ error: "Failed to create timer" });
    }
});
app.post("/api/stopwatches", async (req, res) => {
    try {
        const { timeIntervals, user_id, quality } = req.body;
        const newStopwatch = await Stopwatch.create({ timeIntervals, user_id, quality });
        res.status(201).json(newStopwatch);
    } catch (error) {
        console.error("Error creating timer:", error);
        res.status(500).json({ error: "Failed to create timer" });
    }
});


app.post("/api/emotions", async (req, res) => {
    try {
        let { date, emotions, user_id } = req.body;
        console.log(date, emotions, user_id);

        let dateObj = date ? new Date(date) : new Date();
        if (isNaN(dateObj.getTime())) {
            console.log("Invalid date, using current date");
            dateObj = new Date();
        }
        const formattedDate = dateObj.toISOString().slice(0, 19).replace("T", " ");
        const newEmotion = await Emotions.create({
            date: formattedDate,
            emotions,
            user_id,
        });

        res.status(201).json(newEmotion);
    } catch (error) {
        console.error("Error creating emotion:", error);
        res.status(500).json({ error: "Failed to create emotion" });
    }
});


app.get("/api/users", async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get("/api/user", async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get("/api/users/:userId/timers", async (req, res) => {
    try {
        const { userId } = req.params;
        const timers = await Timer.findAll({ where: { user_id: userId } });
        res.status(200).json(timers);
    } catch (error) {
        console.error("Error fetching timers:", error);
        res.status(500).json({ error: "Failed to fetch timers" });
    }
});
app.get("/api/users/:userId/stopwatches", async (req, res) => {
    try {
        const { userId } = req.params;
        const stopwatches = await Stopwatch.findAll({ where: { user_id: userId } });
        res.status(200).json(stopwatches);
    } catch (error) {
        console.error("Error fetching timers:", error);
        res.status(500).json({ error: "Failed to fetch timers" });
    }
});


app.get("/api/emotions/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const emotions = await Emotions.findAll({ where: { user_id: userId } });
        res.status(200).json(emotions);
    } catch (error) {
        console.error("Error fetching user emotions:", error);
        res.status(500).json({ error: "Failed to fetch emotions for the user" });
    }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.post("/api/predict-study", async (req, res) => {
    const { num_interruptions } = req.body;

    try {
        const response = await axios.post("http://localhost:5000/predict", {
            num_interruptions,
        });

        res.json(response.data);
    } catch (err) {
        console.error("Error calling Flask API:", err.message);
        res.status(500).json({ error: "Failed to get prediction from ML model" });
    }
});


app.put("/api/flashcards", async (req, res) => {
    try {
      const { user_id, data, jar, lastReviewedAt } = req.body;
  
      const updated = await Flashcard.update(
        { jar, lastReviewedAt },
        {
          where: {
            user_id,
            data 
          }
        }
      );
  
      if (updated[0] === 0) {
        return res.status(404).json({ error: "Flashcard bulunamadı" });
      }
  
      res.status(200).json({ message: "Flashcard güncellendi" });
    } catch (error) {
      console.error("Flashcard güncelleme hatası:", error);
      res.status(500).json({ error: "Güncelleme işlemi başarısız" });
    }
  });

app.post("/api/flashcards", async (req, res) => {
    try {
      const { user_id, jar, category, lastReviewedAt, data } = req.body;
  
      const existing = await Flashcard.findOne({ where: { user_id, jar } });

      const newFlashcard = await Flashcard.create({
        user_id,
        jar,
        category,
        lastReviewedAt,
        data
      });
  
      res.status(201).json(newFlashcard);
    } catch (error) {
      console.error("Flashcard error:", error);
      res.status(500).json({ error: "" });
    }
});

app.put("/api/flashcards/:userId/:jar", async (req, res) => {
    try {
      const { userId, jar } = req.params;
      const { data, lastReviewedAt } = req.body;
  
      let flashcard = await Flashcard.findOne({ where: { user_id: userId, jar } });
  
      if (flashcard) {
        await flashcard.update({ data, lastReviewedAt });
        return res.status(200).json(flashcard);
      } else {
        const newCard = await Flashcard.create({
          user_id: userId,
          jar,
          data,
          lastReviewedAt
        });
        return res.status(201).json(newCard);
      }
    } catch (err) {
      console.error("PUT flashcard error:", err);
      res.status(500).json({ error: "Flashcard güncellenemedi" });
    }
});

app.delete("/api/flashcards", async (req, res) => {
    try {
      const { user_id, jar, data } = req.body;
  
      const deleted = await Flashcard.destroy({
        where: { user_id, jar, data }
      });
  
      if (deleted) {
        res.status(200).json({ message: "Flashcard silindi" });
      } else {
        res.status(404).json({ error: "Flashcard bulunamadı" });
      }
    } catch (error) {
      console.error("Flashcard delete error:", error);
      res.status(500).json({ error: "Flashcard delete success" });
    }
});

app.get("/api/flashcards/:userId", async (req, res) => {
    try {
    const { userId } = req.params;
    const flashcards = await Flashcard.findAll({
        where: { user_id: userId }
    });

    res.status(200).json(flashcards);
    } catch (error) {
    console.error("Error fetching user flashcards:", error);
    res.status(500).json({ error: "Failed to fetch flashcards for the user" });
    }
});

app.get("/api/flashcards/:userId/:jar", async (req, res) => {
    try {
      const { userId, jar } = req.params;
      
      const flashcards = await Flashcard.findAll({
        where: {
          user_id: userId,
          jar: jar
        }
      });
  
      res.status(200).json(flashcards);
    } catch (error) {
      console.error("Jar filter hatası:", error);
      res.status(500).json({ error: "Jar filtreli flashcard getirilemedi" });
    }
});
const openai = new OpenAI({ apiKey: 'secret' });

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "Kullanıcının belirttiği dile göre flashcard oluştur. Sadece şu formatta dön: {kelime1: anlam1, kelime2: anlam2}. Açıklama yazma, sadece JSON dön.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    res.json({ result: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API request failed." });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

