const service = require("../services/invoiceService");

exports.create = async (req, res) => {
  try {
    const invoice = await service.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.generateFromSubscription = async (req, res) => {
  try {
    const invoice = await service.generateFromSubscription(
      req.params.subscriptionId,
      req.body
    );
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await service.getAllInvoices(req.user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json(await service.getInvoiceById(req.params.id, req.user));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.confirm = async (req, res) => {
  try {
    res.json(await service.confirmInvoice(req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    res.json(await service.cancelInvoice(req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markPaid = async (req, res) => {
  try {
    res.json(await service.markInvoicePaid(req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.send = async (req, res) => {
  try {
    res.json(await service.sendInvoice(req.params.id, req.user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
