export const asyncHandler = (func) => {
    Promise.resolve(func(request, response, next )).catch((error) => next(error));
}