import React from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';
import {Header, TextInput, Button, Gap} from '../components';
import {API_HOST} from '../config';
import {setLoading} from '../redux/action';
import {storeData, useForm} from '../utills';

const SignIn = ({navigation}) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const onSubmit = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_HOST.url}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });

      const parseRes = await response.json();

      if (parseRes.status === 'success') {
        storeData('user', parseRes.data);
        storeData('token', {value: parseRes.token});
        dispatch(setLoading(false));
        navigation.reset({index: 0, routes: [{name: 'MainApp'}]});
      } else {
        dispatch(setLoading(false));
        showToast(parseRes);
      }
    } catch (err) {
      dispatch(setLoading(false));
      showToast(err.message);
    }
  };

  const showToast = (message, type) => {
    showMessage({
      message,
      type: type === 'success' ? 'success' : 'danger',
      backgroundColor: type === 'success' ? '#1abc9c' : '#d9435e',
    });
  };

  return (
    <View style={styles.page}>
      <Header title={'Sign In'} subtitle={'Find your best ever meal'} />
      <View style={styles.container}>
        <TextInput
          label={'Email Address'}
          placeholder={'Type your email address'}
          value={form.email}
          onChangeText={(value) => setForm('email', value)}
        />
        <Gap height={16} />
        <TextInput
          label={'Password'}
          placeholder={'Type your password'}
          value={form.password}
          onChangeText={(value) => setForm('password', value)}
          secureTextEntry
        />
        <Gap height={24} />
        <Button text={'Sign In'} onPress={onSubmit} />
        <Gap height={12} />
        <Button
          text={'Create new account'}
          color={'#8092a3'}
          textColor={'white'}
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  page: {flex: 1},
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 26,
    marginTop: 18,
    flex: 1,
  },
});
