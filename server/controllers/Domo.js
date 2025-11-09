const mongoose = require('mongoose'); 
const _ = require('underscore'); 
const models = require('../models'); 
const Domo = models.Domo; 

const setName = (name) => _.escape(name).trim(); 

const DomoSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true, 
        set: setName,
    }, 
    age: {
        type: Number, 
        min: 0, 
        required: true,
    }, 
    owner:{
        type: mongoose.Schema.ObjectId, 
        required: true, 
        ref: 'Account', 
    }, 
    createdDate:{
        type: Date, 
        default: Date.now,
    },
}); 

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name, 
    age: doc.age,
});

const makeDomo = async (req, res) => {
    if(!req.body.name || !req.body.age){
        return res.status(400).json({error: 'Both name and age are required!'}); 
    }
    const domoData = {
        name: req.body.name, 
        age: req.bady.age, 
        owner: req.session.account._id, 
    }; 
    try{
        const newDomo = new Domo(domoData); 
        await newDomo.save(); 
        return res.json({redirect: '/maker'});
    } catch(err){
        console.log(err); 
        if(err.code === 11000){
            return res.status(400).json({error: 'Domo already exist!'}); 
        }
        return res.status(500).json({error: 'An error occured making domo!'}); 
    }
}

const DomoModel = mongoose.model('Domo', DomoSchema); 
module.exports = {
    DomoModel, 
    makerPage, 
    makeDomo, 
}
