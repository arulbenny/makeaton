const service = require("../services/reportService");

exports.dashboard = async (req, res) => {
  try {
    res.json(await service.getDashboardSummary(req.query));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.revenue = async (req, res) => {
  try {
    res.json(await service.getRevenueSummary(req.query));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activeSubscriptions = async (req, res) => {
  try {
    res.json(await service.getActiveSubscriptions(req.query));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.outstandingInvoices = async (req, res) => {
  try {
    res.json(await service.getOutstandingInvoices(req.query));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
