const service = require("../services/subscriptionService");
const Subscription = require("../models/Subscription");
const QuotationTemplate = require("../models/QuotationTemplate");

exports.create = async (req, res) => {
  try {
    const subscription = await service.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await service.getSubscriptions(req.user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json(await service.getSubscription(req.params.id, req.user));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await service.updateSubscription(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.transition = async (req, res) => {
  try {
    res.json(
      await service.transitionStatus(
        req.params.id,
        req.params.action,
        req.body
      )
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.renew = async (req, res) => {
  try {
    res.json(await service.renewSubscription(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    res.status(201).json(await QuotationTemplate.create(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listTemplates = async (req, res) => {
  res.json(await QuotationTemplate.find());
};

exports.createFromTemplate = async (req, res) => {
  try {
    const template = await QuotationTemplate.findById(req.params.templateId);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const subscription = await service.createSubscription({
      ...req.body,
      paymentTerms: template.paymentTerms,
      notes: template.notes
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
