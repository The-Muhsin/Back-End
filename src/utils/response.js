// Function to send a success response
function sendSuccessResponse(res, data) {
    res.status(200).json({
        success: true,
        data: data
    });
}

// Function to send an error response
function sendErrorResponse(res, message, statusCode = 500) {
    res.status(statusCode).json({
        success: false,
        error: message
    });
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
};
