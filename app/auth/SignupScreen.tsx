import { FormErrorMessage, TextInput } from "@/components/auth";
import { auth } from "@/config";
import { useGoogleSignIn, useTogglePasswordVisibility } from "@/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AuthenticatedUserContext } from "@/providers/AuthenticatedUserProvider";
import { signupValidationSchema } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupScreen() {
  const { user } = useContext(AuthenticatedUserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { promptAsync } = useGoogleSignIn();
  const [errorState, setErrorState] = useState("");
  const colorScheme = useColorScheme();

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

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

  const handleSignup = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      } else {
        setErrorState("Une erreur inconnue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RNView style={[styles.container, { backgroundColor }]}>
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
          <Ionicons name="person-add" size={32} color={tint} />
          <Text style={[styles.lockInText, { color: tint }]}>LOCK IN</Text>
        </RNView>

        <Text style={[styles.welcomeText, { color: textColor }]}>
          Créer un compte
        </Text>
        <Text style={[styles.subtitleText, { color: textSecondary }]}>
          Rejoins la communauté et commence tes défis
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
            },
          ]}
        >
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
                    textContentType="newPassword"
                    rightIcon={rightIcon}
                    handlePasswordVisibility={handlePasswordVisibility}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    style={[styles.customInput]}
                  />
                  <FormErrorMessage
                    error={errors.password}
                    visible={!!touched.password}
                  />
                </RNView>

                <RNView style={styles.inputContainer}>
                  <RNView style={styles.inputHeader}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color={textSecondary}
                    />
                    <Text style={[styles.inputLabel, { color: textSecondary }]}>
                      Confirmer le mot de passe
                    </Text>
                  </RNView>
                  <TextInput
                    name="confirmPassword"
                    leftIconName="key-variant"
                    leftIconLibrary="MaterialCommunityIcons"
                    placeholder="Répétez votre mot de passe"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={confirmPasswordVisibility}
                    textContentType="password"
                    rightIcon={confirmPasswordIcon}
                    handlePasswordVisibility={handleConfirmPasswordVisibility}
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    style={[styles.customInput]}
                  />
                  <FormErrorMessage
                    error={errors.confirmPassword}
                    visible={!!touched.confirmPassword}
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

                {/* Terms & Conditions */}
                <RNView style={styles.termsContainer}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color={textSecondary}
                  />
                  <Text style={[styles.termsText, { color: textSecondary }]}>
                    En créant un compte, vous acceptez nos{" "}
                    <Text style={{ color: tint, fontWeight: "600" }}>
                      conditions d'utilisation
                    </Text>{" "}
                    et notre{" "}
                    <Text style={{ color: tint, fontWeight: "600" }}>
                      politique de confidentialité
                    </Text>
                  </Text>
                </RNView>

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
                    S'inscrire avec Google
                  </Text>
                </TouchableOpacity>

                {/* Signup Button */}
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#F97316", "#EA580C"]}
                    style={styles.signupGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size={20} />
                    ) : (
                      <>
                        <Ionicons
                          name="person-add-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.signupButtonText}>
                          Créer mon compte
                        </Text>
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
            onPress={() => router.push("/auth/LoginScreen")}
          >
            <Text style={[styles.linkText, { color: textSecondary }]}>
              Déjà un compte ?{" "}
              {/* TODO: Solution temporaire pour tous les soucis
              de mot non render sur mobile */}
            </Text>
            <Text style={[styles.linkTextBold, { color: tint }]}>
              Se connecter
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
    paddingHorizontal: 20,
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
  },
  inputContainer: {
    marginBottom: 20,
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
    width: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 8,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
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
  signupButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  signupGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  bottomLinks: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
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
