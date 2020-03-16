const firebase = require("firebase");
require("firebase/firestore");

const firebaseConfig = {
    // TODO: These keys shouldn't live here
    apiKey: "AIzaSyDlc0O8-HyoTnrj1fR2A3OkOfPhpiM_9qg",
    authDomain: "react-tac-toe-eb1e6.firebaseapp.com",
    projectId: "react-tac-toe-eb1e6"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();