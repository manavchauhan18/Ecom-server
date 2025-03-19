import morgan from 'morgan';
import express, { Application } from "express";

const loadLogger = (app: Application) => {
    app.use(morgan((tokens, req, res) => {
        return [
            "Access ",
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    }));
}

const loadRequestParsers = (app: Application) => {
    app.use(express.urlencoded({extended:true}));
    app.use(express.json({ limit: '10mb' }));
}

module.exports = {
    loadLogger,
    loadRequestParsers
}