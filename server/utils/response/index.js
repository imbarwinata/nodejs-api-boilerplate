module.exports = {
    Failed({res, code, message}) {
        res.status(200).send({
            code,
            message,
            copyright: "© 2018 Imbar Winata"
        });
    },
    Success({res, code, status, total, results}) {
        res.status(200).send({
            code,
            status,
            copyright: "© 2018 Imbar Winata",
            data: {
                total,
                results
            }
        });
    }
}