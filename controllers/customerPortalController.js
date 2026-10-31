const service = require("../services/customerPortalService");

exports.subscriptions = async (req, res) => {
  try {
    res.json(await service.getMySubscriptions(req.user._id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.invoices = async (req, res) => {
  try {
    res.json(await service.getMyInvoices(req.user._id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.payments = async (req, res) => {
  try {
    res.json(await service.getMyPayments(req.user._id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.status = async (req, res) => {
  try {
    res.json(await service.getMySubscriptionStatus(req.user._id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
