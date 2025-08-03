import { auth, db } from '@/config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from 'react';

import * as AuthSession from 'expo-auth-session';
console.log(AuthSession.makeRedirectUri());
  

const redirectUri = AuthSession.makeRedirectUri({
useProxy: true,
//native: 'exp://LockIn',
  });
WebBrowser.maybeCompleteAuthSession();
console.log('Generated URI:', AuthSession.makeRedirectUri({ useProxy: true }));

export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: Constants.expoConfig?.extra?.EXPO_CLIENT_ID,
    //iosClientId: iosClientId,
    androidClientId: Constants.expoConfig?.extra?.ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.WEB_CLIENT_ID,
    redirectUri,
    responseType: 'id_token', // 👈 crucial!
    scopes: ['openid', 'profile', 'email'],
   
  });

  useEffect(() => {
      console.log("Google auth request object:", request);
      console.log("Google Sign-In response:", response);

      if (response?.type === 'success') {
        const idToken = response.params?.id_token;
        console.log("ID Token:", idToken);

        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          signInWithCredential(auth, credential)
            .then((userCredential) => {
              const user = userCredential.user;
              //add user to firestore if not exists
              if (user) { 
                getDoc(doc(db, "users", user.uid)).then((docSnap) => {
                  if (!docSnap.exists()) {
                    setDoc(doc(db, "users", user.uid), {
                      email: user.email,
                      name: user.displayName?.split(' ')[1] || "LockedIn",
                      firstname: user.displayName?.split(' ')[0] || "Username",
                      currentDay: 0,
                      totalDays: 0,
                      amountDeposited: 0,
                      amountRecovered: 0,
                      currentStreak: 0,
                      todayValidated: false,
                      createdAt: new Date().toISOString(),
                    }).then(() => {
                      console.log("User added to Firestore:", user.uid);
                    }).catch((error) => {
                      console.error("Error adding user to Firestore:", error);
                    });
                  } else {
                    console.log("User already exists in Firestore:", user.uid);
                  }
                });
              }
              else {
                console.error("No user is currently signed in.");
              }
              console.log("✅ Google Sign-In successful:", user);
            })
            .catch((err) =>
              console.error('🔥 Firebase sign-in error:', err)
            );
          }
          else {
            console.error("No user is currently signed in.");
          }
        
      } else if (response?.type === 'error') {
        console.error("❌ Google Sign-In error:", response.error);
      }
  }, [response]);

  return { promptAsync };

};