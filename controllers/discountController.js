const service = require("../services/discountService");

exports.create = async (req, res) => {
  try {
    res.status(201).json(await service.createDiscount(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await service.getDiscounts());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json(await service.getDiscountById(req.params.id));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await service.updateDiscount(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.apply = async (req, res) => {
  try {
    res.json(
      await service.applyDiscountToInvoice(
        req.params.invoiceId,
        req.params.discountId
      )
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.applyEligible = async (req, res) => {
  try {
    res.json(await service.applyEligibleDiscounts(req.params.invoiceId));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
