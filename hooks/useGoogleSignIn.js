import { auth } from '@/config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
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
          signInWithCredential(auth, credential).catch((err) =>
            console.error('🔥 Firebase sign-in error:', err)
          );
        }
      } else if (response?.type === 'error') {
        console.error("❌ Google Sign-In error:", response.error);
      }
  }, [response]);

  return { promptAsync };

};