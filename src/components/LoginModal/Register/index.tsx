import { Controller, useForm } from 'react-hook-form';
import FieldContainer from '../../FieldContainer';
import { Button, Text, View } from 'react-native';
import Input from '../../Input';
import { useCallback, useState } from 'react';
import { register, RegisterProps } from '../../../data/service/WMAuthService';
import { AuthProps, useUser } from '../../../contexts/UserContext';
import { styles } from './styles';

type RegisterModalProps = {
  onClose: () => void;
  onBack: () => void;
  onRegister: (props: AuthProps) => void;
  onError: (error: string) => void;
};

type ModalProps = {
  title: string;
  message: string;
};

export const RegisterModal = ({
  onClose,
  onBack,
  onRegister,
  onError,
}: RegisterModalProps) => {
  const {
    control: registerControl,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterProps>();

  const onRegisterSubmit = useCallback((data: RegisterProps) => {
    register(data)
      .then((user) => {
        onRegister(user);

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
          <Text>Nome</Text>
          <FieldContainer width={'100%'}>
            <Controller
              control={registerControl}
              name='registerName'
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
          {registerErrors.registerName && (
            <Text style={styles.errorText}>
              {registerErrors.registerName.message}
            </Text>
          )}
        </View>
        <View style={styles.loginContainer}>
          <Text>E-Mail</Text>
          <FieldContainer width={'100%'}>
            <Controller
              control={registerControl}
              name='registerEmail'
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
          {registerErrors.registerEmail && (
            <Text style={styles.errorText}>
              {registerErrors.registerEmail.message}
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
        <Button title='Voltar' onPress={() => onBack()} />
      </View>
    </View>
  );
};
