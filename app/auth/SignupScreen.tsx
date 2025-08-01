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
import { signupValidationSchema } from "@/utils";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { promptAsync } = useGoogleSignIn();
  const [errorState, setErrorState] = useState("");

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  // Theme-aware colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const buttonColor = useThemeColor({}, "button");

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const handleSignup = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      } else {
        setErrorState("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View isSafe style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          <Text style={[styles.screenTitle, { color: textColor }]}>
            Create a new account!
          </Text>
        </View>

        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupValidationSchema}
          onSubmit={handleSignup}
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
                textContentType="newPassword"
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

              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="Enter password again"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={!!touched.confirmPassword}
              />

              {errorState !== "" && (
                <FormErrorMessage error={errorState} visible={true} />
              )}

              <GoogleButton
                onPress={async () => {
                  try {
                    const result = await promptAsync();
                    if (result.type === "success") {
                      // TODO: Handle successful Google sign-in
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
                    Signup
                  </Text>
                )}
              </Button>
            </>
          )}
        </Formik>

        <Button
          style={styles.borderlessButtonContainer}
          borderless
          onPress={() => {
            router.push("/auth/LoginScreen");
          }}
          title="Already have an account? "
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 20,
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
    width: "100%",
  },
});

export default SignupScreen;
