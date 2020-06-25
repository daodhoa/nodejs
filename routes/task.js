const Task = require('../models/Task');
const express = require('express');
const route = express.Router();
const authCheck = require('./authCheck');
const Joi = require('@hapi/joi');

const taskSchema = Joi.object({
    title: Joi.string().required(),
    status: Joi.number().integer().min(0).max(2)
});

route.get('/', authCheck, async (req, res) => {
    const user_id = req.user._id;
    try {
        const tasks = await Task.find({ user_id: user_id });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(400).json(error);
    }
});

route.post('/', authCheck, async (req, res) => {
    const user_id = req.user._id;
    const validation = taskSchema.validate(req.body);
    if (validation.error) {
        return res.status(422).json(validation.error.details[0].message);
    }
    const task = new Task({
        user_id,
        title: req.body.title,
        status: req.body.status
    });
    try {
        const newTask = await task.save();
        return res.status(201).json({
            'status': 'success',
            'task': newTask
        })
    } catch (error) {
        return res.status(400).json(error);
    }
});

module.exports = route;