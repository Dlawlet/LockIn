import DatePicker from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";
import ValidationDaysPicker from "@/components/ValidationDaysPicker";
import { useThemeColor } from "@/hooks/useThemeColor";
import { createGoal } from "@/services/goalService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
const CATEGORIES = [
  { id: "fitness", label: "Fitness", icon: "fitness" },
  { id: "finance", label: "Finance", icon: "card" },
  { id: "education", label: "Education", icon: "school" },
  { id: "personal", label: "Personal", icon: "person" },
  { id: "career", label: "Career", icon: "briefcase" },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  amountDeposited: Yup.number().min(1, "Le montant doit être au moins 1"),
  startDate: Yup.string()
    .required("La date de début est requise")
    .test("is-valid-date", "Date invalide", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  endDate: Yup.string()
    .required("La date de fin est requise")
    .test("is-valid-date", "Date invalide", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test(
      "is-after-start",
      "La date de fin doit être après la date de début",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) >= new Date(startDate);
      }
    ),
  totalDays: Yup.number().min(1, "Au moins 1 jour requis"),
  category: Yup.string().required("Veuillez sélectionner une catégorie"),
  validationWindow: Yup.object().shape({
    start: Yup.string()
      .required("Heure de début requise")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM requis"),
    end: Yup.string()
      .required("Heure de fin requise")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM requis")
      .test(
        "is-after-start",
        "L'heure de fin doit être après l'heure de début",
        function (value) {
          const { start } = this.parent;
          if (!value || !start) return true;

          const [startHour, startMin] = start.split(":").map(Number);
          const [endHour, endMin] = value.split(":").map(Number);
          const startTime = startHour * 60 + startMin;
          const endTime = endHour * 60 + endMin;

          return endTime > startTime;
        }
      ),
  }),
  validationType: Yup.string().required(),
  weekdays: Yup.array().when("validationType", {
    is: "weekdays",
    then: (schema) =>
      schema.min(1, "Sélectionnez au moins un jour de la semaine"),
    otherwise: (schema) => schema,
  }),
  customDays: Yup.array().when("validationType", {
    is: "custom",
    then: (schema) =>
      schema.min(1, "Sélectionnez au moins un jour personnalisé"),
    otherwise: (schema) => schema,
  }),
});

export default function GoalConfigPage() {
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    completed: false,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    amountDeposited: 0,
    validationWindow: { start: "19:00", end: "21:00" },
    category: "",
    currentDays: 0,
    totalDays: 30,
    status: "active",
    // New validation fields
    validationType: "everyday" as "everyday" | "weekdays" | "custom",
    weekdays: [] as number[],
    customDays: [] as string[],
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsLoading(true);

      // Prepare goal data - remove undefined values
      const goalData: Partial<Goal> = {
        title: values.title,
        description: values.description,
        completed: false,
        startDate: values.startDate,
        endDate: values.endDate,
        amountDeposited: values.amountDeposited,
        validationWindow: values.validationWindow,
        category: values.category,
        totalDays: values.totalDays,
        status: "active",
        validationType: values.validationType,
      };

      // Only add weekdays if validationType is 'weekdays'
      if (values.validationType === "weekdays" && values.weekdays.length > 0) {
        goalData.weekdays = values.weekdays;
      }

      // Only add customDays if validationType is 'custom'
      if (values.validationType === "custom" && values.customDays.length > 0) {
        goalData.customDays = values.customDays;
      }

      const result = await createGoal(goalData as Omit<Goal, "currentDays">);

      if (result.success) {
        Alert.alert("Succès !", "Votre objectif a été créé avec succès.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de l'objectif.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
        }) => (
          <ScrollView
            style={[styles.container, { backgroundColor }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.header, { backgroundColor: cardBackground }]}>
              <Text style={[styles.headerTitle, { color: textPrimary }]}>
                Créer un nouvel objectif
              </Text>
              <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
                Paramétrez votre objectif et commencez à suivre votre
                progression
              </Text>
            </View>

            <View
              style={[
                styles.form,
                { backgroundColor: cardBackground, borderColor: border },
              ]}
            >
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Titre de l'objectif
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: textPrimary,
                      borderColor: border,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                  placeholder="Entrez le titre"
                  placeholderTextColor={textSecondary}
                  value={values.title}
                  onChangeText={handleChange("title")}
                />
                {touched.title && errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Description
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: textPrimary,
                      borderColor: border,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                  placeholder="Décrivez votre objectif"
                  placeholderTextColor={textSecondary}
                  value={values.description}
                  onChangeText={handleChange("description")}
                  multiline
                  numberOfLines={3}
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Montant à déposer
                </Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="trophy"
                    size={20}
                    color={tint}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputWithPadding,
                      {
                        color: textPrimary,
                        borderColor: border,
                        backgroundColor: backgroundColor,
                      },
                    ]}
                    placeholder="0"
                    placeholderTextColor={textSecondary}
                    value={
                      values.amountDeposited
                        ? values.amountDeposited.toString()
                        : ""
                    }
                    onChangeText={(text) =>
                      setFieldValue("amountDeposited", Number(text))
                    }
                    keyboardType="numeric"
                  />
                </View>
                {touched.amountDeposited && errors.amountDeposited && (
                  <Text style={styles.errorText}>{errors.amountDeposited}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Dates
                </Text>
                <View style={styles.dateRow}>
                  <View style={styles.dateInputContainer}>
                    <Text style={[styles.subLabel, { color: textSecondary }]}>
                      Début
                    </Text>
                    <DatePicker
                      value={values.startDate}
                      onDateSelect={(date) => setFieldValue("startDate", date)}
                      placeholder="Date de début"
                    />
                    {touched.startDate && errors.startDate && (
                      <Text style={styles.errorText}>{errors.startDate}</Text>
                    )}
                  </View>

                  <View style={styles.dateInputContainer}>
                    <Text style={[styles.subLabel, { color: textSecondary }]}>
                      Fin
                    </Text>
                    <DatePicker
                      value={values.endDate}
                      onDateSelect={(date) => setFieldValue("endDate", date)}
                      placeholder="Date de fin"
                    />
                    {touched.endDate && errors.endDate && (
                      <Text style={styles.errorText}>{errors.endDate}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Validation Days */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Jours de validation
                </Text>
                <ValidationDaysPicker
                  validationType={values.validationType}
                  weekdays={values.weekdays}
                  customDays={values.customDays}
                  startDate={values.startDate}
                  endDate={values.endDate}
                  onValidationChange={(type, data) => {
                    setFieldValue("validationType", type);
                    if (type === "weekdays") {
                      setFieldValue("weekdays", data || []);
                      setFieldValue("customDays", []);
                    } else if (type === "custom") {
                      setFieldValue("customDays", data || []);
                      setFieldValue("weekdays", []);
                    } else {
                      setFieldValue("weekdays", []);
                      setFieldValue("customDays", []);
                    }
                  }}
                  onTotalDaysUpdate={(totalDays) => {
                    setFieldValue("totalDays", totalDays);
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Créneau horaire de validation
                </Text>
                <TimePicker
                  startTime={values.validationWindow.start}
                  endTime={values.validationWindow.end}
                  onTimeChange={(start, end) => {
                    setFieldValue("validationWindow", { start, end });
                  }}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textPrimary }]}>
                  Catégorie
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryContainer}
                >
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        {
                          borderColor:
                            values.category === category.id ? tint : border,
                          backgroundColor:
                            values.category === category.id
                              ? "rgba(0, 0, 0, 0.1)"
                              : backgroundColor,
                        },
                      ]}
                      onPress={() => setFieldValue("category", category.id)}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={
                          values.category === category.id ? tint : textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color:
                              values.category === category.id
                                ? textPrimary
                                : textSecondary,
                          },
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {touched.category && errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: tint,
                  shadowColor: tint,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                    Création...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.saveButtonText}>Créer l'objectif</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  form: {
    padding: 24,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: 48,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginBottom: 32,
    paddingVertical: 18,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  dateInput: {
    height: 48,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  timePicker: {
    marginTop: 12,
  },
  timeInput: {
    height: 48,
  },
  totalDaysText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
