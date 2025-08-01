import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import {
  Button,
  FormErrorMessage,
  LoadingIndicator,
  TextInput,
  View,
} from "@/components/auth";
import { Colors, auth } from "@/config";
import { passwordResetSchema } from "@/utils";
import { useRouter } from "expo-router";

const ForgotPasswordScreen = () => {
  const [errorState, setErrorState] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSendPasswordResetEmail = async (values: { email: any }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      router.replace("/auth/LoginScreen");
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      } else {
        setErrorState("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingIndicator />;

  return (
    <View isSafe style={styles.container}>
      <View style={styles.innerContainer} isSafe={undefined}>
        <Text style={styles.screenTitle}>Reset your password</Text>
      </View>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={passwordResetSchema}
        onSubmit={(values) => handleSendPasswordResetEmail(values)}
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
            {/* Email input field */}
            <TextInput
              name="email"
              leftIconName="email"
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              rightIcon={undefined}
              handlePasswordVisibility={undefined}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            {/* Display Screen Error Mesages */}
            {errorState !== "" ? (
              <FormErrorMessage error={errorState} visible={true} />
            ) : null}
            {/* Password Reset Send Email  button */}
            <Button style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </Button>
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <Button
        style={styles.borderlessButtonContainer}
        borderless
        title={"Go back to Login"}
        onPress={() => router.push("/auth/LoginScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  innerContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.black,
    paddingTop: 20,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ForgotPasswordScreen;
