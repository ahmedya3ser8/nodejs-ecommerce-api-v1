import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/appError.js';
import ApiFeatures from '../utils/apiFeatures.js';

const deleteOne = (Model) => asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findByIdAndDelete(id);
  if (!document) {
    return next(new AppError(`No document For This Id ${id}`, 404));
  }
  // Trigger "deleteOne" event when update document
  await document.deleteOne(); 
  res.status(204).send();
});

const updateOne = (Model) => asyncHandler(async (req, res, next) => {
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!document) {
    return next(new AppError(`No document For This Id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  await document.save();
  res.status(200).json({
    data: document
  })
})

const createOne = (Model) => asyncHandler(async (req, res) => {
  const newDocument = await Model.create(req.body)
  res.status(201).json({
    data: newDocument
  })
});

const getOne = (Model, options) => asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let query = Model.findById(id).select('-__v');
  if (options) {
    query = query.populate(options)
  }
  const document = await query;
  if (!document) {
    return next(new AppError(`No document For This Id ${id}`, 404));
  }
  res.status(200).json({
    data: document
  })
})

const getAll = (Model, modelName = '') => asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj
  }
  const countDocuments = await Model.countDocuments();
  const features = new ApiFeatures(Model.find(filter), req.query)
    .paginate(countDocuments)
    .filter()
    .limitFields()
    .search(modelName)
    .sort()

  const { paginationResult, mongooseQuery } = features;
  const documents = await mongooseQuery;

  return res.status(200).json({
    results: documents.length,
    paginationResult,
    data: documents
  })
})

export default {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
}