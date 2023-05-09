///drag adn drop
import styles from '@/styles/Home.module.css';
import { socketEmitter, updateSession } from './sessionsService';
import { notifications } from '@mantine/notifications';

const handleDragStart = (e: any, item: any, setState: Function) => {
  setState(item);
  console.log({ item });
  e.dataTransfer?.setData('text/plain', JSON.stringify(item));
  e.currentTarget?.classList.add(styles.dragOver);
};
const handleDragEnd = (e: any) => {
  // Remove the class added during drag start
  e.currentTarget?.classList.remove(styles.dragged);
};

const handleDragOver = (e: any) => {
  e.preventDefault();
  e.currentTarget.classList.add(styles.dragOver);
};

const handleDragLeave = (e: any) => {
  // Remove the class from the empty slot when the dragged item leaves it
  e.currentTarget.classList.remove(styles.dragOver);
};

const handleDrop = async (e: any, targetItem: any, setState: Function) => {
  e.preventDefault();
  e.currentTarget.classList.remove(styles.dragOver);
  // Do something with the dragged item and the target item
  const session = e.dataTransfer?.getData('text/plain');

  const date = targetItem;

  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const dateString = date.toLocaleString('en-US', options);

  if (session) {
    if (
      window.confirm(
        `Are you sure you want to move this session to ${dateString}?`
      )
    ) {
      let newSession = JSON.parse(session);
      newSession.date_time = targetItem;
      await updateSession(newSession);
      socketEmitter();
      notifications.show({
        title: 'Session Edited',
        message: `Edit successful for session at ${newSession.location} with ${newSession.client_id}`,
      });
    }

    setState(null);
  }
};

export {
  handleDragOver,
  handleDragStart,
  handleDragEnd,
  handleDrop,
  handleDragLeave,
};
