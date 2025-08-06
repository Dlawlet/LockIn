import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

interface ValidationDaysPickerProps {
  validationType: "everyday" | "weekdays" | "custom";
  weekdays?: number[];
  customDays?: string[];
  onValidationChange: (
    type: "everyday" | "weekdays" | "custom",
    data?: number[] | string[]
  ) => void;
  onTotalDaysUpdate: (totalDays: number) => void;
  startDate: string;
  endDate: string;
}

const WEEKDAYS = [
  { id: 1, name: "Lundi", short: "L" },
  { id: 2, name: "Mardi", short: "M" },
  { id: 3, name: "Mercredi", short: "M" },
  { id: 4, name: "Jeudi", short: "J" },
  { id: 5, name: "Vendredi", short: "V" },
  { id: 6, name: "Samedi", short: "S" },
  { id: 0, name: "Dimanche", short: "D" },
];

export default function ValidationDaysPicker({
  validationType,
  weekdays = [],
  customDays = [],
  onValidationChange,
  onTotalDaysUpdate,
  startDate,
  endDate,
  errors,
}: ValidationDaysPickerProps & { errors?: string }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomDays, setSelectedCustomDays] =
    useState<string[]>(customDays);

  const cardBackground = useThemeColor({}, "cardBackground");
  const backgroundColor = useThemeColor({}, "background");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Calculate total days based on validation type
  const calculateTotalDays = (type: string, data?: number[] | string[]) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDaysBetween =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    switch (type) {
      case "everyday":
        return totalDaysBetween;
      case "weekdays":
        if (!data || data.length === 0) return 0;
        let validDays = 0;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if ((data as number[]).includes(d.getDay())) {
            validDays++;
          }
        }
        return validDays;
      case "custom":
        return ((data as string[]) || []).length;
      default:
        return 0;
    }
  };

  const getValidationText = () => {
    const totalDays = calculateTotalDays(
      validationType,
      validationType === "weekdays" ? weekdays : customDays
    );

    switch (validationType) {
      case "everyday":
        return `Tous les jours (${totalDays} jours)`;
      case "weekdays":
        const selectedWeekdays = WEEKDAYS.filter((w) => weekdays.includes(w.id))
          .map((w) => w.short)
          .join(", ");
        return weekdays.length > 0
          ? `${selectedWeekdays} (${totalDays} jours)`
          : "Sélectionner les jours";
      case "custom":
        return customDays.length > 0
          ? `${customDays.length} jour(s) personnalisé(s)`
          : "Jours personnalisés";
      default:
        return "Sélectionner les jours de validation";
    }
  };

  const handleValidationTypeChange = (
    type: "everyday" | "weekdays" | "custom",
    data?: number[] | string[]
  ) => {
    onValidationChange(type, data);
    const totalDays = calculateTotalDays(type, data);
    onTotalDaysUpdate(totalDays);
  };

  const toggleWeekday = (dayId: number) => {
    const newWeekdays = weekdays.includes(dayId)
      ? weekdays.filter((id) => id !== dayId)
      : [...weekdays, dayId];
    handleValidationTypeChange("weekdays", newWeekdays);
  };

  const handleCustomDayPress = (day: any) => {
    const dateString = day.dateString;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const selectedDate = new Date(dateString);

    // Only allow dates within the goal period
    if (selectedDate < start || selectedDate > end) return;

    const newCustomDays = selectedCustomDays.includes(dateString)
      ? selectedCustomDays.filter((d) => d !== dateString)
      : [...selectedCustomDays, dateString];
    setSelectedCustomDays(newCustomDays);
  };

  const saveCustomDays = () => {
    handleValidationTypeChange("custom", selectedCustomDays);
    setIsModalVisible(false);
  };

  // Generate marked dates for custom calendar
  const getMarkedDates = () => {
    const marked: any = {};

    // Mark goal period
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split("T")[0];
        marked[dateString] = {
          color: `${tint}20`,
          textColor: textPrimary,
        };
      }
    }

    // Mark selected custom days
    selectedCustomDays.forEach((date) => {
      marked[date] = {
        selected: true,
        selectedColor: tint,
        selectedTextColor: "#FFFFFF",
      };
    });

    return marked;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.validationButton,
          { borderColor: border, backgroundColor: backgroundColor },
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="calendar" size={20} color={tint} />
        <Text style={[styles.validationText, { color: textPrimary }]}>
          {getValidationText()}
        </Text>
        <Ionicons name="chevron-down" size={20} color={textSecondary} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardBackground, borderColor: border },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>
                Jours de validation
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Everyday Option */}
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { borderColor: border, backgroundColor: backgroundColor },
                  validationType === "everyday" && {
                    backgroundColor: `${tint}20`,
                    borderColor: tint,
                  },
                ]}
                onPress={() => handleValidationTypeChange("everyday")}
              >
                <Ionicons name="checkmark-circle" size={20} color={tint} />
                <Text style={[styles.optionText, { color: textPrimary }]}>
                  Tous les jours
                </Text>
              </TouchableOpacity>

              {/* Weekdays Option */}
              <View
                style={[
                  styles.optionContainer,
                  { borderColor: border, backgroundColor: backgroundColor },
                ]}
              >
                <TouchableOpacity
                  style={styles.optionHeader}
                  onPress={() =>
                    handleValidationTypeChange("weekdays", weekdays)
                  }
                >
                  <Ionicons name="calendar-outline" size={20} color={tint} />
                  <Text style={[styles.optionText, { color: textPrimary }]}>
                    Jours de la semaine
                  </Text>
                </TouchableOpacity>

                {validationType === "weekdays" && (
                  <View style={styles.weekdayGrid}>
                    {WEEKDAYS.map((day) => (
                      <TouchableOpacity
                        key={day.id}
                        style={[
                          styles.weekdayButton,
                          {
                            borderColor: border,
                            backgroundColor: backgroundColor,
                          },
                          weekdays.includes(day.id) && {
                            backgroundColor: tint,
                            borderColor: tint,
                          },
                        ]}
                        onPress={() => toggleWeekday(day.id)}
                      >
                        <Text
                          style={[
                            styles.weekdayText,
                            {
                              color: weekdays.includes(day.id)
                                ? "#FFFFFF"
                                : textPrimary,
                            },
                          ]}
                        >
                          {day.short}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Custom Days Option */}
              <View
                style={[
                  styles.optionContainer,
                  { borderColor: border, backgroundColor: backgroundColor },
                ]}
              >
                <TouchableOpacity
                  style={styles.optionHeader}
                  onPress={() =>
                    handleValidationTypeChange("custom", customDays)
                  }
                >
                  <Ionicons name="calendar" size={20} color={tint} />
                  <Text style={[styles.optionText, { color: textPrimary }]}>
                    Jours personnalisés
                  </Text>
                </TouchableOpacity>

                {validationType === "custom" && (
                  <View>
                    <Calendar
                      onDayPress={handleCustomDayPress}
                      markedDates={getMarkedDates()}
                      markingType="period"
                      theme={{
                        backgroundColor: cardBackground,
                        calendarBackground: cardBackground,
                        textSectionTitleColor: textPrimary,
                        selectedDayBackgroundColor: tint,
                        selectedDayTextColor: "#FFFFFF",
                        todayTextColor: tint,
                        dayTextColor: textPrimary,
                        textDisabledColor: textSecondary,
                        arrowColor: tint,
                        disabledArrowColor: textSecondary,
                        monthTextColor: textPrimary,
                        indicatorColor: tint,
                        textDayFontWeight: "500",
                        textMonthFontWeight: "600",
                        textDayHeaderFontWeight: "600",
                      }}
                      style={{
                        borderRadius: 12,
                        padding: 10,
                      }}
                    />
                    <TouchableOpacity
                      style={[styles.saveButton, { backgroundColor: tint }]}
                      onPress={saveCustomDays}
                    >
                      <Text style={styles.saveButtonText}>
                        Sauvegarder ({selectedCustomDays.length} jours)
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  validationButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
  },
  validationText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  weekdayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    paddingTop: 0,
  },
  weekdayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    margin: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
