var crypto = require("./crypto.js")
var constants = require("../constants.js")
var trsTypes = require('../transaction-types');
var slots = require("../time/slots.js")
var options = require('../options')
var addressHelper = require('../address.js')
const { Bignum } = require('@ddn/utils');

function createMultiTransfer(outputs, secret, secondSecret, cb) {
	var keys = crypto.getKeys(secret)

	if (!outputs || outputs.length == 0) {
		throw new Error('Invalid fileHash format')
	}
	var sender = addressHelper.generateBase58CheckAddress(keys.public_key)
	var fee = constants.fees.multitransfer
	var amount = Bignum.new(0);   //Bignum update
	var recipientId = []
	for (var i = 0; i < outputs.length; i++) {
		var output = outputs[i]
		if (!output.recipientId || !output.amount) {
			return cb("output recipient or amount null");
		}

		if (!addressHelper.isAddress(output.recipientId)) {
			return cb("Invalid output recipient");
		}

        // Bignum update
		// if (output.amount <= 0) {
        if (Bignum.isLessThanOrEqualTo(output.amount, 0)) {
			return cb("Invalid output amount");
		}

		if (output.recipientId == sender) {
			return cb("Invalid output recipientId, cannot be your self");
		}

        // Bignum update
        // amount += output.amount
        amount = Bignum.plus(amount, output.amount);
        
		recipientId.push(output.recipientId)
	}

	var transaction = {
		type: trsTypes.MULTITRANSFER,
		nethash: options.get('nethash'),
		amount: amount.toString(),  //Bignum update amount,
		fee: fee + "",
		recipientId: recipientId.join('|'),
		senderPublicKey: keys.public_key,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		asset: {
			output: {
				outputs: outputs
			}
		},
	}

	crypto.sign(transaction, keys)

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret)
		crypto.secondSign(transaction, secondKeys)
	}
	transaction.id = crypto.getId(transaction)
	return transaction
}

module.exports = {
	createMultiTransfer: createMultiTransfer
}