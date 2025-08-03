import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  View as RNView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { FormErrorMessage, TextInput } from "@/components/auth";
import { auth } from "@/config";
import { useGoogleSignIn, useTogglePasswordVisibility } from "@/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AuthenticatedUserContext } from "@/providers/AuthenticatedUserProvider";
import { loginValidationSchema } from "@/utils";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthenticatedUserContext);
  const router = useRouter();
  const { promptAsync } = useGoogleSignIn();
  const colorScheme = useColorScheme();

  // Themed colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

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
      setErrorState("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RNView style={[styles.container, { backgroundColor, width: "100%" }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />

      {/* Header avec gradient */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#0F172A", "#1E293B"]
            : ["#F8FAFC", "#E2E8F0"]
        }
        style={styles.header}
      >
        <RNView style={styles.lockIconContainer}>
          <Ionicons name="lock-closed" size={32} color={tint} />
          <Text style={[styles.lockInText, { color: tint }]}>LOCK IN</Text>
        </RNView>

        <Text style={[styles.welcomeText, { color: textColor }]}>
          Bienvenue !
        </Text>
        <Text style={[styles.subtitleText, { color: textSecondary }]}>
          Connecte-toi pour accéder à tes défis
        </Text>
      </LinearGradient>

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
      >
        {/* Formik Card */}
        <RNView
          style={[
            styles.formCard,
            {
              backgroundColor: cardBackground,
              borderColor: border,
              width: "100%",
            },
          ]}
        >
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
                <RNView style={styles.inputContainer}>
                  <RNView style={styles.inputHeader}>
                    <Ionicons
                      name="mail-outline"
                      size={16}
                      color={textSecondary}
                    />
                    <Text style={[styles.inputLabel, { color: textSecondary }]}>
                      Email
                    </Text>
                  </RNView>
                  <TextInput
                    name="email"
                    leftIconName="email"
                    leftIconLibrary="MaterialCommunityIcons"
                    placeholder="Entrez votre email"
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
                    style={[styles.customInput]}
                  />
                  <FormErrorMessage
                    error={errors.email}
                    visible={!!touched.email}
                  />
                </RNView>

                <RNView style={styles.inputContainer}>
                  <RNView style={styles.inputHeader}>
                    <Ionicons
                      name="key-outline"
                      size={16}
                      color={textSecondary}
                    />
                    <Text style={[styles.inputLabel, { color: textSecondary }]}>
                      Mot de passe
                    </Text>
                  </RNView>
                  <TextInput
                    name="password"
                    leftIconName="key-variant"
                    leftIconLibrary="MaterialCommunityIcons"
                    placeholder="Entrez votre mot de passe"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={passwordVisibility}
                    textContentType="password"
                    rightIcon={rightIcon}
                    handlePasswordVisibility={handlePasswordVisibility}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    style={[
                      styles.customInput,
                      {
                        borderColor:
                          errors.password && touched.password ? "" : border,
                      },
                    ]}
                  />
                  <FormErrorMessage
                    error={errors.password}
                    visible={!!touched.password}
                  />
                </RNView>

                {errorState !== "" && (
                  <RNView style={styles.errorContainer}>
                    <Ionicons
                      name="warning-outline"
                      size={16}
                      color="#EF4444"
                    />
                    <FormErrorMessage error={errorState} visible={true} />
                  </RNView>
                )}

                {/* Google Sign In Button */}
                <TouchableOpacity
                  style={[
                    styles.googleButton,
                    {
                      backgroundColor: cardBackground,
                      borderColor: border,
                    },
                  ]}
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
                >
                  <Ionicons name="logo-google" size={20} color={textColor} />
                  <Text style={[styles.googleButtonText, { color: textColor }]}>
                    Continuer avec Google
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#F97316", "#EA580C"]}
                    style={styles.loginGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size={20} />
                    ) : (
                      <>
                        <Ionicons
                          name="log-in-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </RNView>

        {/* Bottom Links */}
        <RNView style={styles.bottomLinks}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/auth/SignupScreen")}
          >
            <Text style={[styles.linkText, { color: textSecondary }]}>
              Pas encore de compte ?{" "}
            </Text>
            <Text style={[styles.linkTextBold, { color: tint }]}>
              Créer un compte
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/auth/ForgotPasswordScreen")}
          >
            <Ionicons name="help-circle-outline" size={16} color={tint} />
            <Text style={[styles.linkTextBold, { color: tint }]}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </RNView>
      </KeyboardAwareScrollView>

      {/* Footer */}
      <RNView style={[styles.footer, { backgroundColor: backgroundColor }]}>
        <Text style={[styles.footerText, { color: tint }]}>
          LockIn App Version 1.0.0 @2025
        </Text>
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  lockIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  lockInText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
    letterSpacing: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    width: "100%",
  },
  inputContainer: {
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  customInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  loginGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  bottomLinks: {
    alignItems: "center",
    marginTop: 30,
    gap: 16,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    fontSize: 14,
  },
  linkTextBold: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
