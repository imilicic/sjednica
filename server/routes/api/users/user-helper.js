var validators = [
    {
        Name: "email",
        Max: 40,
        Min: 5,
        Type: "char",
        RegExp: "^[A-Za-z][A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$"
    },
    {
        Name: "firstName",
        Max: 40,
        Min: 2,
        Type: "char"
    },
    {
        Name: "lastName",
        Max: 40,
        Min: 2,
        Type: "char"
    },
    {
        Name: "password",
        Max: 40,
        Min: 8,
        Type: "char",
        RegExp: "^(?=[a-zA-Z0-9]{8,})(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*"
    },
    {
        Name: "phoneNumber",
        Max: 40,
        Min: 10,
        Type: "char",
        RegExp: "^[0-9]{3} [0-9]{6,10}$"
    }
];

module.exports.validators = validators;