import { Colors } from '@/config';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput as RNTextInput, View as RNView, TouchableOpacity } from 'react-native';

const iconLibraries = {
  Ionicons,
  MaterialCommunityIcons,
};

export const TextInput = ({
  width = '100%',
  leftIconName,
  leftIconLibrary = 'Ionicons', // new prop
  rightIcon,
  rightIconLibrary = 'Ionicons', // new prop
  handlePasswordVisibility,
  ...otherProps
}) => {
  const renderIcon = (iconName, iconLibrary, props = {}) => {
    if (!iconName || !iconLibraries[iconLibrary]) return null;
    const IconComponent = iconLibraries[iconLibrary];
    return <IconComponent name={iconName} size={22} color={Colors.mediumGray} {...props} />;
  };

  return (
    <RNView
      style={{
        backgroundColor: Colors.white,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 12,
        width,
        borderWidth: 1,
        borderColor: Colors.mediumGray
      }}
    >
      {leftIconName ? (
        renderIcon(leftIconName, leftIconLibrary, { style: { marginRight: 10 } })
      ) : null}
      <RNView style={{ flex: 1 }}>
      <RNTextInput
        style={{
          flex: 1,
          width: '100%',
          fontSize: 18,
          color: Colors.black
        }}
        placeholderTextColor={Colors.mediumGray}
        {...otherProps}
      />
      </RNView>

      {rightIcon ? (
        <TouchableOpacity onPress={handlePasswordVisibility}>
          {renderIcon(rightIcon, rightIconLibrary)}
        </TouchableOpacity>
      ) : null}
    </RNView>
  );
};
