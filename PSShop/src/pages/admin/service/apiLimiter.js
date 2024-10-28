// apiLimiter.js
let callCount = 0;
const MAX_CALLS = 10; // Giới hạn số lần gọi
const TIME_FRAME = 60000; // 1 phút

export const apiLimiter = (apiCall) => {
  return new Promise((resolve, reject) => {
    if (callCount < MAX_CALLS) {
      callCount++;
      apiCall()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          setTimeout(() => {
            callCount = 0; // Reset call count after TIME_FRAME
          }, TIME_FRAME);
        });
    } else {
      reject(new Error("Too many API calls. Please wait."));
    }
  });
};

