import { Button, Pressable, Text, View } from 'react-native';
import UserIconSVG from '../../../assets/icons/circle-user.svg';
import { useLoader } from '../../contexts/ScreenLoader';
import { syncData } from '../../data/service/WMdataService';
import CustomAlert from '../Alert';
import { useCallback, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { LoginModal } from '../LoginModal';
import { styles } from './styles';

type ModalProps = {
  title: string;
  message: string;
};

export default function HeaderTitle(props: { title: string }) {
  const { activeUser } = useUser();

  const { showLoader, hideLoader } = useLoader();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalProps>({
    title: '',
    message: '',
  });

  const [showModalLogin, setShowModalLogin] = useState(false);

  const handleSync = useCallback(async () => {
    showLoader();
    try {
      await syncData(setModalVisible, setModalContent);
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  }, [setModalVisible, setModalContent]);

  return (
    <View style={styles.homeHeader}>
      <Text>{props.title}</Text>
      <View style={styles.dataContainer}>
        <Button title='Sincronizar dados' onPress={handleSync} />
        {!activeUser ? (
          <Pressable onPress={() => setShowModalLogin(true)}>
            <UserIconSVG width={20} height={20}></UserIconSVG>
          </Pressable>
        ) : (
          <Text>{activeUser.username}</Text>
        )}
      </View>
      <CustomAlert
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
      <LoginModal
        visible={showModalLogin}
        onClose={() => setShowModalLogin(false)}
      />
    </View>
  );
}
