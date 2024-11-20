import { Button, Text, View } from 'react-native';
import FieldContainer from '../../FieldContainer';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../Input';
import { auth, LoginProps } from '../../../data/service/WMAuthService';
import { useCallback, useState } from 'react';
import { styles } from './styles';
import { AuthProps } from '../../../contexts/UserContext';

type LoginModalProps = {
  onClose: () => void;
  onRegister: () => void;
  onAuth: (props: AuthProps) => void;
  onError: (error: string) => void;
};

export const LoginFormModal = ({
  onClose,
  onAuth,
  onError,
  onRegister,
}: LoginModalProps) => {
  const {
    control: loginControl,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginProps>();

  const onLoginSubmit = useCallback((data: LoginProps) => {
    auth(data)
      .then((user) => {
        onAuth(user);

        onClose();
      })
      .catch((error) => {
        onError(error.toString());
      });
  }, []);

  return (
    <View>
      <View style={styles.loginForm}>
        <View style={styles.loginContainer}>
          <Text>Login</Text>
          <FieldContainer width={'100%'}>
            <Controller
              control={loginControl}
              name='loginEmail'
              rules={{
                required: 'Campo obrigatório',
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  event={(text: string) => {
                    onChange(text);
                  }}
                />
              )}
            />
          </FieldContainer>
          {loginErrors.loginEmail && (
            <Text style={styles.errorText}>
              {loginErrors.loginEmail.message}
            </Text>
          )}
        </View>
        <View style={styles.loginContainer}>
          <Text>Password</Text>
          <FieldContainer width={'100%'}>
            <Controller
              control={loginControl}
              name='password'
              rules={{
                required: 'Campo obrigatório',
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  securityTextEntry={true}
                  value={value}
                  event={(text: string) => {
                    onChange(text);
                  }}
                />
              )}
            />
          </FieldContainer>
          {loginErrors.password && (
            <Text style={styles.errorText}>{loginErrors.password.message}</Text>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title='Login' onPress={loginHandleSubmit(onLoginSubmit)} />
        <Button title='Cadastre-se' onPress={() => onRegister()} />
      </View>
    </View>
  );
};
