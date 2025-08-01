import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Button,
  FormErrorMessage,
  GoogleButton,
  Logo,
  TextInput,
  View,
} from "@/components/auth";
import { Images, auth } from "@/config";
import { useGoogleSignIn, useTogglePasswordVisibility } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AuthenticatedUserContext } from "@/providers/AuthenticatedUserProvider";
import { loginValidationSchema } from "@/utils";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthenticatedUserContext);
  const router = useRouter();
  const { promptAsync } = useGoogleSignIn();

  // Themed colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const buttonColor = useThemeColor({}, "button");

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setErrorState(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor }]} isSafe={undefined}>
        <KeyboardAwareScrollView enableOnAndroid>
          {/* Logo & Title */}
          <View isSafe style={styles.logoContainer}>
            <Logo uri={Images.logo} />
            <Text style={[styles.screenTitle, { color: textColor }]}>
              Welcome back!
            </Text>
          </View>

          {/* Formik */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  importantForAutofill="yes"
                  autoFocus
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  rightIcon={undefined}
                  handlePasswordVisibility={undefined}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={!!touched.email}
                />

                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={!!touched.password}
                />

                {errorState !== "" && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}

                <GoogleButton
                  onPress={async () => {
                    try {
                      const result = await promptAsync();
                      if (result.type === "success") {
                        // Handle success
                      }
                    } catch (error) {
                      console.error("Google Sign-In error:", error);
                    }
                  }}
                />

                <Button
                  style={[styles.button, { backgroundColor: buttonColor }]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={[styles.buttonText, { color: "white" }]}>
                      Login
                    </Text>
                  )}
                </Button>
              </>
            )}
          </Formik>

          {/* Navigation links */}
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"Create a new account?"}
            onPress={() => router.push("/auth/SignupScreen")}
          />
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"Forgot Password"}
            onPress={() => router.push("/auth/ForgotPasswordScreen")}
          />
        </KeyboardAwareScrollView>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: backgroundColor }]}>
        <Text style={[styles.footerText, { color: "orange" }]}>
          LockIn App Version 1.0.0 @2025
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 20,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "700",
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
