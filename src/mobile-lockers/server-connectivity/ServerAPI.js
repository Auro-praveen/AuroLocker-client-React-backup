import serverURL from "../../GlobalVariable/serverUrl.json";
import axios from "axios";

const mainServerUrl = serverURL.path;
const adminServerUrl = serverURL.localPath;
const mobileLockerServerUrl = serverURL.templeLockerPath;

// get api for mobile lockers for sending payload to main Locker Server
const commonGETApiForMobileLockersMainServer = async (getPayload) => {


  let serverResponse = await fetch
    .get(mobileLockerServerUrl + "?" + getPayload)
    .then((data) => JSON.parse(data))
    .catch((err) => console.log("some Error Occured : " + err));

  if (
    !serverResponse ||
    serverResponse === undefined ||
    serverResponse === null
  ) {
    serverResponse = {
      status: "resp-404",
    };
  } else {
    serverResponse = {
      ...serverResponse,
      status:"resp-200"
    }
  }

  return serverResponse;

};

// get api for mobile lockers for sending payload to admin server of locker application
const commonGETApiForMobileLockersAdminServer = async (
  pathName,
  getPayload
) => {


  let serverResponse = await fetch
    .get(adminServerUrl + pathName + "?" + getPayload)
    .then((data) => JSON.parse(data))
    .catch((err) => console.log("some Error Occured : " + err));





  if (
    !serverResponse ||
    serverResponse === undefined ||
    serverResponse === null
  ) {
    serverResponse = {
      status: "resp-404",
    };
  } else {
    serverResponse = {
      ...serverResponse,
      status:"resp-200"
    }
  }
  return serverResponse;
};

// post api for mobile lockers for sending payload to main locker server
const commonPOSTapiForMobileLockersMainServer = async (postPayload) => {


  let serverResponse = await fetch(mobileLockerServerUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    
    body: JSON.stringify(postPayload)
  })
    .then((resp) => { return resp.json() })
    // .then((data) => )
    .catch((err) => console.log("some error occured : " + err));

  // if (
  //   !serverResponse ||
  //   serverResponse === undefined ||
  //   serverResponse === null
  // ) {
  //   serverResponse = {
  //     status: "resp-404",
  //   };
  // }


  if (
    !serverResponse ||
    serverResponse === undefined ||
    serverResponse === null
  ) {
    serverResponse = {
      status: "resp-404",
    };
  } else {
    serverResponse = {
      ...serverResponse,
      status:"resp-200"
    }

    console.log(serverResponse);
    
  }

  return serverResponse;
};

// post api for mobile lockers for sending payload to admin server of locker application
const commonPOSTapiForMobileLockersAdminServer = async (
  pathName,
  postPayload
) => {

  // let serverResponse = await axios
  //   .post(adminServerUrl + pathName, { postPayload })
  //   .then((data) => JSON.parse(data))
  //   .catch((err) => console.log("some error occured : " + err));

  let serverResponse = await fetch(adminServerUrl + pathName, {
    method: "POST",
    headers: {
      Accept: "Application/json",
    },
    body: JSON.stringify(postPayload)
  })
    .then((data) => {
      JSON.parse(data)
      console.log(data)
    })
    .catch((err) => console.log("some error occured : " + err));

  if (
    !serverResponse ||
    serverResponse === undefined ||
    serverResponse === null
  ) {
    serverResponse = {
      status: "resp-404",
    };
  } else {
    serverResponse = {
      ...serverResponse,
      status:"resp-200"
    }
  }
  return serverResponse;
};

export {
  commonGETApiForMobileLockersAdminServer,
  commonGETApiForMobileLockersMainServer,
  commonPOSTapiForMobileLockersAdminServer,
  commonPOSTapiForMobileLockersMainServer,
};
