const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Atlas connection
mongoose.connect('mongodb+srv://pruthviraj:16122004@cluster0.tbshjra.mongodb.net/contactManager?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose Schema
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  birthday: String,
  address: String,
  photo: String
});

const Contact = mongoose.model('Contact', contactSchema);

// ✅ API Routes
app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.post('/contacts', async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.json(contact);
});

app.put('/contacts/:id', async (req, res) => {
  const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/contacts/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
