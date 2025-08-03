import GoogleLogo from '@/assets/images/google-logo.png'; // Adjust the path as necessary
import { Colors } from '@/config';
import { Image, Pressable, StyleSheet, Text } from 'react-native';

export const GoogleButton = ({ onPress }) => {
  return (
    <Pressable style={[styles.button]} onPress={onPress}>
      <Image source={GoogleLogo} style={styles.logo} />
      <Text style={styles.text}>Continue with Google</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.orange,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    marginTop: 16,
    alignSelf: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  Text: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
});
