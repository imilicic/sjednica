module.exports = {
    secret: 'secret',
    connectionObject: {
        host: 'sql7.freemysqlhosting.net',
        user: 'sql7246002',
        password: 'mKEKphYQJh',
        database: 'sql7246002',
        typeCast: function(field, next) {
            if (field.type === 'DATE') {
                return field.string();
            }
            return next();
        }
    }
}