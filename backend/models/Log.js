// models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true }, // Create Task / Update Task / Delete Task
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  updatedContent: { type: Object, default: null }, // store changed fields for update or full object for create
});

module.exports = mongoose.model('Log', LogSchema);
