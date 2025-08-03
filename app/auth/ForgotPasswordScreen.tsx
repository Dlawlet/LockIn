import { FormErrorMessage, TextInput } from "@/components/auth";
import LoadingIndicator from "@/components/LoadingIndicator";
import { auth } from "@/config";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { passwordResetSchema } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import {
  View as RNView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ForgotPasswordScreen() {
  const [errorState, setErrorState] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  // Themed colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  const handleSendPasswordResetEmail = async (values: { email: string }) => {
    setLoading(true);
    setErrorState("");
    try {
      await sendPasswordResetEmail(auth, values.email);
      setEmailSent(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      } else {
        setErrorState("Une erreur inattendue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

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
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={tint} />
        </TouchableOpacity>

        <RNView style={styles.lockIconContainer}>
          <Ionicons name="key" size={32} color={tint} />
          <Text style={[styles.lockInText, { color: tint }]}>LOCK IN</Text>
        </RNView>

        <Text style={[styles.welcomeText, { color: textColor }]}>
          Mot de passe oublié ?
        </Text>
      </LinearGradient>

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
      >
        {!emailSent ? (
          <>
            {/* Info Card */}
            <RNView
              style={[
                styles.infoCard,
                {
                  backgroundColor: `${tint}10`,
                  borderColor: `${tint}30`,
                },
              ]}
            >
              <Ionicons name="information-circle" size={20} color={tint} />
              <Text style={[styles.infoText, { color: textColor }]}>
                Entrez l'adresse email associée à votre LockIn. Vous recevrez un
                lien pour créer un nouveau mot de passe.
              </Text>
            </RNView>

            {/* Form Card */}
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
                initialValues={{ email: "" }}
                validationSchema={passwordResetSchema}
                onSubmit={handleSendPasswordResetEmail}
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
                        <Text
                          style={[styles.inputLabel, { color: textSecondary }]}
                        >
                          Adresse email
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

                    {/* Send Reset Email Button */}
                    <TouchableOpacity
                      style={styles.resetButton}
                      onPress={() => handleSubmit()}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["#F97316", "#EA580C"]}
                        style={styles.resetGradient}
                      >
                        <Ionicons name="mail" size={20} color="white" />
                        <Text style={styles.resetButtonText}>
                          Envoyer le lien de réinitialisation
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </RNView>
          </>
        ) : (
          // Success Card
          <RNView
            style={[
              styles.successCard,
              {
                backgroundColor: cardBackground,
                borderColor: "#10B981",
              },
            ]}
          >
            <RNView style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            </RNView>
            <Text style={[styles.successTitle, { color: textColor }]}>
              Email envoyé !
            </Text>
            <Text style={[styles.successText, { color: textSecondary }]}>
              Nous avons envoyé un lien de réinitialisation à votre adresse
              email. Vérifiez votre boîte mail et suivez les instructions.
            </Text>
            <TouchableOpacity
              style={[styles.backToLoginButton, { borderColor: tint }]}
              onPress={() => router.replace("/auth/LoginScreen")}
            >
              <Text style={[styles.backToLoginText, { color: tint }]}>
                Retour à la connexion
              </Text>
            </TouchableOpacity>
          </RNView>
        )}

        {/* Help Section */}
        <RNView style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: textColor }]}>
            Besoin d'aide ?
          </Text>
          <TouchableOpacity style={styles.helpItem}>
            <Ionicons
              name="help-circle-outline"
              size={16}
              color={textSecondary}
            />
            <Text style={[styles.helpText, { color: textSecondary }]}>
              Je ne reçois pas l'email
            </Text>
            {/* TODO implement email troubleshooting functionality */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color={textSecondary}
            />
            <Text style={[styles.helpText, { color: textSecondary }]}>
              Contacter le support
            </Text>
            {/* TODO  implement support contact functionality */}
          </TouchableOpacity>
        </RNView>

        {/* Bottom Link */}
        <RNView style={styles.bottomLinks}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/auth/LoginScreen")}
          >
            <Ionicons name="arrow-back-circle-outline" size={16} color={tint} />
            <Text style={[styles.linkTextBold, { color: tint }]}>
              Retour à la connexion
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
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 8,
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
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: "wrap",
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
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
  resetButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  resetGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  successCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 2,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  backToLoginButton: {
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: "600",
  },
  helpSection: {
    marginTop: 20,
    gap: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  helpText: {
    fontSize: 14,
    flexGrow: 1,
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
