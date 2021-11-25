var config = {
    apiKey: "AIzaSyA8llGBdW5KHoVxOP71vdsipDnvDDD0tWQ",
    authDomain: "opunk-9c443.firebaseapp.com",
    projectId: "opunk-9c443",
    storageBucket: "opunk-9c443.appspot.com",
    messagingSenderId: "77845533494",
    appId: "1:77845533494:web:6310c96640a738ed5f1997",
    measurementId: "G-FBR33N94C5",
};
firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

var uiConfig = {
    signInOptions: [

        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],


    tosUrl: "/tos",

    privacyPolicyUrl: function () {
        window.location.assign("/privacy-policy");
    },

    callbacks: {
        signInSuccess: function (user, credential, redirectUrl) {
            user
                .getIdToken()
                .then(function (idToken) {

                    window.location.href = "/savecookie?idToken=" + idToken;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", uiConfig);