import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TimePickerProps {
  startTime: string;
  endTime: string;
  onTimeChange: (start: string, end: string) => void;
  errors?: { start?: string; end?: string };
}

export default function TimePicker({
  startTime,
  endTime,
  onTimeChange,
  errors,
}: TimePickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tempStart, setTempStart] = useState(startTime);
  const [tempEnd, setTempEnd] = useState(endTime);
  const [localErrors, setLocalErrors] = useState({ start: "", end: "" });

  const cardBackground = useThemeColor({}, "cardBackground");
  const backgroundColor = useThemeColor({}, "background");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  const validateTime = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const formatTime = (input: string): string => {
    // Auto-format as user types
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const handleStartTimeChange = (text: string) => {
    const formatted = formatTime(text);
    setTempStart(formatted);

    if (formatted.length === 5) {
      if (!validateTime(formatted)) {
        setLocalErrors((prev) => ({ ...prev, start: "Format HH:MM invalide" }));
      } else {
        setLocalErrors((prev) => ({ ...prev, start: "" }));
      }
    }
  };

  const handleEndTimeChange = (text: string) => {
    const formatted = formatTime(text);
    setTempEnd(formatted);

    if (formatted.length === 5) {
      if (!validateTime(formatted)) {
        setLocalErrors((prev) => ({ ...prev, end: "Format HH:MM invalide" }));
      } else {
        setLocalErrors((prev) => ({ ...prev, end: "" }));
      }
    }
  };

  const validateTimeRange = (): boolean => {
    if (!validateTime(tempStart) || !validateTime(tempEnd)) {
      return false;
    }

    const [startHour, startMin] = tempStart.split(":").map(Number);
    const [endHour, endMin] = tempEnd.split(":").map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (endTime <= startTime) {
      setLocalErrors((prev) => ({
        ...prev,
        end: "L'heure de fin doit être après l'heure de début",
      }));
      return false;
    }

    return true;
  };

  const handleSave = () => {
    setLocalErrors({ start: "", end: "" });

    if (!validateTime(tempStart)) {
      setLocalErrors((prev) => ({ ...prev, start: "Format HH:MM invalide" }));
      return;
    }

    if (!validateTime(tempEnd)) {
      setLocalErrors((prev) => ({ ...prev, end: "Format HH:MM invalide" }));
      return;
    }

    if (validateTimeRange()) {
      onTimeChange(tempStart, tempEnd);
      setIsVisible(false);
    }
  };

  const formatTimeDisplay = () => {
    if (!startTime && !endTime) return "";
    return `${startTime || "00:00"} - ${endTime || "00:00"}`;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.timeButton,
          {
            borderColor: errors?.start || errors?.end ? "red" : border,
            backgroundColor: backgroundColor,
          },
        ]}
        onPress={() => {
          setTempStart(startTime);
          setTempEnd(endTime);
          setLocalErrors({ start: "", end: "" });
          setIsVisible(true);
        }}
      >
        <Ionicons name="time" size={20} color={tint} />
        <Text
          style={[
            styles.timeText,
            { color: startTime || endTime ? textPrimary : textSecondary },
          ]}
        >
          {formatTimeDisplay() || "HH:MM - HH:MM"}
        </Text>
        <Ionicons name="chevron-down" size={20} color={textSecondary} />
      </TouchableOpacity>

      {(errors?.start || errors?.end) && (
        <Text style={styles.errorText}>{errors?.start || errors?.end}</Text>
      )}

      <Modal visible={isVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardBackground, borderColor: border },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>
                Créneau horaire
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color={textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputsContainer}>
              <View style={styles.timeInputGroup}>
                <Text style={[styles.timeLabel, { color: textSecondary }]}>
                  Début
                </Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      color: textPrimary,
                      borderColor: localErrors.start ? "red" : border,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                  placeholder="19:00"
                  placeholderTextColor={textSecondary}
                  value={tempStart}
                  onChangeText={handleStartTimeChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
                {localErrors.start ? (
                  <Text style={styles.errorText}>{localErrors.start}</Text>
                ) : null}
              </View>

              <Text style={[styles.timeSeparator, { color: textSecondary }]}>
                -
              </Text>

              <View style={styles.timeInputGroup}>
                <Text style={[styles.timeLabel, { color: textSecondary }]}>
                  Fin
                </Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    {
                      color: textPrimary,
                      borderColor: localErrors.end ? "red" : border,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                  placeholder="21:00"
                  placeholderTextColor={textSecondary}
                  value={tempEnd}
                  onChangeText={handleEndTimeChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
                {localErrors.end ? (
                  <Text style={styles.errorText}>{localErrors.end}</Text>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: tint,
                  opacity: localErrors.start || localErrors.end ? 0.5 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={!!(localErrors.start || localErrors.end)}
            >
              <Text style={styles.saveButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
  },
  timeText: {
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  timeInputsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlign: "center",
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 36,
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
