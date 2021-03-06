const Quandl = require("quandl");

var quandl = new Quandl({
  auth_token: process.env.QUANDL_API_KEY,
  api_version: 3
});

function attachMessage(err) {
  err.message = err.message || "unknown error with the quandl api";
}

module.exports = function quandlRequest(opt, cb) {
  quandl.dataset(
    {
      source: "WIKI",
      table: opt.code
    },
    {
      order: "asc",
      column_index: 4,
      start_date: "2014-01-01"
    },
    function(err, result) {
      err = typeof err === "string" ? JSON.parse(err) : err;
      result = typeof result === "string" ? JSON.parse(result) : result;

      if(err) {
        attachMessage(err);
        cb({ error: err });
      }
      else if(result.quandl_error) {
        attachMessage(result.quandl_error);
        cb(result.quandl_error);
      }
      else {
        var data = result.dataset;
        cb(null, {
          code: data.dataset_code,
          name: data.name,
          data: data.data.map((d) => {
            return [new Date(d[0]).getTime(), d[1]];
          })
        });
      }
    });
};
