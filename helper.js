exports.success = (message, data) => {
  return {
    status: "success",
    message,
    data
  };
};

exports.error = message => {
  return {
    status: "error",
    message
  };
};
