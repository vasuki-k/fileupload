var oracledb = require('oracledb');

var dbConfig = {
    user: process.env.DBAAS_USER_NAME || "DB",
    password: process.env.DBAAS_USER_PASSWORD || "DB",
    connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/XE",
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,
    tzOffSet: "0.229"
};

module.exports.doConnect = function (cb) {
    oracledb.getConnection(
            {
                user: dbConfig.user,
                password: dbConfig.password,
                connectString: dbConfig.connectString
            },
            cb);
};


module.exports.dorelease = function (conn) {
    if (conn) {
        conn.close();
    }
};

module.exports.doSelect = function (conn, selectStatement, cb) {
    conn.execute(selectStatement
            , [], {
        outFormat: oracledb.OBJECT, // Return the result as Object
           autoCommit: true// Override the default non-autocommit behavior
    }, function (err, result) {
        if (err) {
            console.log('Error in execution of select statement' + err.message);
            return cb(err, conn);
        } else {
            console.log(result);
            return cb(null, result);
        }
    }
    );
};