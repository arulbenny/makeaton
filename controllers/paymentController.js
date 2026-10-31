const service = require("../services/paymentService");

exports.create = async (req, res) => {
  try {
    const payment = await service.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await service.getPayments(req.user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json(await service.getPaymentById(req.params.id, req.user));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getInvoiceBalance = async (req, res) => {
  try {
    res.json(await service.getInvoiceBalance(req.params.invoiceId));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
