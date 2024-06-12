export const messageApi = {
  send: (phoneNo: string | undefined, content: string | undefined) =>
    new Promise((resolve: any, reject: any) => {
      const SMS_API_KEY = import.meta.env.VITE_APP_SMS_API_KEY;
      const SMS_SECRET_KEY = import.meta.env.VITE_APP_SMS_SECRET_KEY;
      const SMS_CALLER_ID = import.meta.env.VITE_APP_SMS_CALLER_ID;

      const url = `https://smpp.revesms.com:7790/sendtext?apikey=${SMS_API_KEY}&secretkey=${SMS_SECRET_KEY}&toUser=${phoneNo}&messageContent=${content}&callerID=${SMS_CALLER_ID}`;
      fetch(url, {
        mode: "no-cors",
        referrerPolicy: "unsafe-url",
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),
};
