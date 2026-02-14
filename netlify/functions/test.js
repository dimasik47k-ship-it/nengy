exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: 'Test function works!',
      path: event.path,
      rawUrl: event.rawUrl
    })
  };
};
