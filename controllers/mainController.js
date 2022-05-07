const express = require('express');

exports.about = (req,res) => {
    res.render('about');
}
exports.contact = (req,res) => {
    res.render('contact');
}