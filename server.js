require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Subscription Management API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


const invoiceRoutes = require('./routes/invoiceRoutes');

app.use('/api/invoices', invoiceRoutes);


const paymentRoutes = require('./routes/paymentRoutes');

const discountRoutes = require('./routes/discountRoutes');

app.use('/api/payments', paymentRoutes);

app.use('/api/discounts', discountRoutes);


const reportRoutes = require('./routes/reportRoutes');

const customerPortalRoutes = require('./routes/customerPortalRoutes');

app.use('/api/reports', reportRoutes);

app.use('/api/customer-portal', customerPortalRoutes);

