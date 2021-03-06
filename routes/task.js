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
        const query = {
            user_id: user_id
        }
        if (req.query.status) {
            query.status = req.query.status
        }
        const tasks = await Task.find(query);
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

route.delete('/:_id', authCheck, async (req, res) => {
    const user_id = req.user._id;
    const task_id = req.params._id;
    if (!task_id) {
        return res.status(422).json({'error': 'Please provide task id'});
    }
    try {
        const task = await Task.findOneAndDelete({ _id: task_id, user_id });
        return res.status(204).json(task);
    } catch (error) {
        return res.status(400).json(error);
    }
});

module.exports = route;