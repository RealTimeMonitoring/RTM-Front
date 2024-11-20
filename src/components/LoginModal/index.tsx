import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, View } from 'react-native';
import { AuthProps, useUser } from '../../contexts/UserContext';
import {
  auth,
  LoginProps,
  register,
  RegisterProps,
} from '../../data/service/WMAuthService';
import FieldContainer from '../FieldContainer';
import Input from '../Input';
import CustomModal from '../Modal';
import { styles } from './styles';

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const LoginModal = ({ visible, onClose }: LoginModalProps) => {
  const { updateUser } = useUser();

  const {
    control: loginControl,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginProps>();

  const {
    control: registerControl,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterProps>();

  const [showRegister, setShowRegister] = useState(false);

  const onLoginSubmit = useCallback((data: LoginProps) => {
    try {
      auth(data).then((user) => {
        updateUser(user);

        onClose();
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onRegisterSubmit = useCallback((data: RegisterProps) => {
    try {
      register(data).then((user) => {
        updateUser(user);

        onClose();
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const LoginForm = () => {
    return (
      <View>
        <View style={styles.loginForm}>
          <View style={styles.loginContainer}>
            <Text>Login</Text>
            <FieldContainer width={'100%'}>
              <Controller
                control={loginControl}
                name='email'
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
            {loginErrors.email && (
              <Text style={styles.errorText}>{loginErrors.email.message}</Text>
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
              <Text style={styles.errorText}>
                {loginErrors.password.message}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button title='Login' onPress={loginHandleSubmit(onLoginSubmit)} />
          <Button
            title='Cadastre-se'
            onPress={() =>
              setShowRegister(() => {
                resetLogin();
                return true;
              })
            }
          />
        </View>
      </View>
    );
  };

  const RegiterForm = () => {
    return (
      <View>
        <View style={styles.loginForm}>
          <View style={styles.loginContainer}>
            <Text>Nome</Text>
            <FieldContainer width={'100%'}>
              <Controller
                control={registerControl}
                name='username'
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
            {registerErrors.username && (
              <Text style={styles.errorText}>
                {registerErrors.username.message}
              </Text>
            )}
          </View>
          <View style={styles.loginContainer}>
            <Text>E-Mail</Text>
            <FieldContainer width={'100%'}>
              <Controller
                control={registerControl}
                name='email'
                rules={{
                  required: 'Campo obrigatório',
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: 'E-mail inválido',
                  },
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
            {registerErrors.email && (
              <Text style={styles.errorText}>
                {registerErrors.email.message}
              </Text>
            )}
          </View>
          <View style={styles.loginContainer}>
            <Text>Password</Text>
            <FieldContainer width={'100%'}>
              <Controller
                control={registerControl}
                name='password'
                rules={{
                  required: 'Campo obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Senha deve ter no mínimo 3 caracteres',
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <Input
                    value={value}
                    securityTextEntry={true}
                    event={(text: string) => {
                      onChange(text);
                    }}
                  />
                )}
              />
            </FieldContainer>
            {registerErrors.password && (
              <Text style={styles.errorText}>
                {registerErrors.password.message}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            title='Registrar'
            onPress={registerHandleSubmit(onRegisterSubmit)}
          />
          <Button
            title='Voltar'
            onPress={() =>
              setShowRegister(() => {
                resetRegister();
                return false;
              })
            }
          />
        </View>
      </View>
    );
  };

  return (
    <CustomModal
      onClose={() => {
        setShowRegister(false);
        onClose();
      }}
      visible={visible}
    >
      {showRegister ? <RegiterForm></RegiterForm> : <LoginForm></LoginForm>}
    </CustomModal>
  );
};
