module.exports = {

    name: "publicKey",

    validate: function(str) {
        if (str.length == 0) {
            return true;
        }

        try {
            const publicKey = Buffer.from(str, 'hex');
            return publicKey.length == 32;
        } catch (e) {
            return false;
        }
    }

};
