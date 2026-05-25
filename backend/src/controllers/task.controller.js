import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ data: tasks });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task)
    return res
      .status(404)
      .json({ statusCode: 404, message: "Vazifa topilmadi" });
  res.json({ data: task });
};

export const createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user.id,
    status: "TODO",
  });
  res
    .status(201)
    .json({ data: task, message: "Vazifa muvaffaqiyatli yaratildi" });
};

export const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task)
    return res
      .status(404)
      .json({ statusCode: 404, message: "Vazifa topilmadi" });

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ data: updated, message: "Vazifa muvaffaqiyatli yangilandi" });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task)
    return res
      .status(404)
      .json({ statusCode: 404, message: "Vazifa topilmadi" });

  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Vazifa muvaffaqiyatli o'chirildi" });
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task)
    return res
      .status(404)
      .json({ statusCode: 404, message: "Vazifa topilmadi" });

  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  res.json({
    data: { _id: updated._id, status: updated.status },
    message: "Vazifa holati yangilandi",
  });
};
