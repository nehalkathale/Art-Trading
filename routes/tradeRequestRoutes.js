const express = require('express');
const controller = require('../controllers/tradeRequestController');
const {isLoggedIn} = require('../middleware/auth');
const {validateId} = require('../middleware/validator')
const router = express.Router();

//get details for trading.
router.get('/makeOffer/:id',validateId,isLoggedIn,controller.createTrade)

//trade elements
router.post('/createTrade',isLoggedIn,controller.createTradeRequest);

// get user requested trades
router.get('/userRequestedTrades',isLoggedIn,controller.getMyTradeRequests);

//get trade request for user
router.get('/tradeRequestForUser',isLoggedIn,controller.getTradeRequestForMe);

//delete trade request
router.post('/deleteTradeRequest/:id',isLoggedIn,controller.deleteTrade);

//accept trade request
router.post('/acceptTradeRequest/:id',isLoggedIn,controller.acceptTrade);

//reject trade request
router.post('/rejectTradeRequest/:id',isLoggedIn,controller.rejectTrade);
module.exports = router;