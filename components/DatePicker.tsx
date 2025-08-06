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
import { Calendar } from "react-native-calendars";

interface DatePickerProps {
  value: string;
  onDateSelect: (date: string) => void;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export default function DatePicker({
  value,
  onDateSelect,
  placeholder = "YYYY-MM-DD",
  iconName = "calendar",
}: DatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardBackground = useThemeColor({}, "cardBackground");
  const backgroundColor = useThemeColor({}, "background");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  return (
    <>
      <View
        style={[
          styles.inputWithIcon,
          { borderColor: border, backgroundColor: backgroundColor },
        ]}
      >
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsVisible(true)}
        >
          <Ionicons name={iconName} size={20} color={tint} />
        </TouchableOpacity>
        <TextInput
          style={[styles.dateInput, { color: textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={textSecondary}
          value={value}
          onChangeText={onDateSelect}
        />
      </View>

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
                Sélectionner une date
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color={textPrimary} />
              </TouchableOpacity>
            </View>

            <Calendar
              onDayPress={(day) => {
                onDateSelect(day.dateString);
                setIsVisible(false);
              }}
              markedDates={{
                [value]: { selected: true, selectedColor: tint },
              }}
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
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={{
                borderRadius: 12,
                padding: 10,
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingRight: 16,
  },
  iconButton: {
    padding: 16,
  },
  dateInput: {
    fontSize: 16,
    flex: 1,
    paddingVertical: 16,
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
