"use strict";
module.exports = {
    jwt: {
        secret: 'dfglkerglkerjg',
        tokens: {
            access: {
                type: "access",
                expiresIn: "2m"
            },
            refresh: {
                type: "refresh",
                expiresIn: "15d"
            }
        }
    }
};
