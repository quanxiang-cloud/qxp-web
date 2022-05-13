import { Page, Text, Paragraph, Image, Button, Icon, Link, Modal, Input, Radio, Textarea, Grid, Container } from '@one-for-all/ui';
import Form from '../../portal/modules/apps-management/pages/page-design/registry/form/form/form';
import Table from '../../portal/modules/apps-management/pages/page-design/registry/form/table/table';
import TaskList from '@c/task-lists';
import UserAvatarMenu from '@c/user-avatar-menu';

const legacyUIComponents = {
  page: Page,
  text: Text,
  para: Paragraph,
  image: Image,
  button: Button,
  icon: Icon,
  link: Link,
  modal: Modal,
  input: Input,
  radio: Radio,
  textarea: Textarea,
  form: Form,
  table: Table,
  grid: Grid,
  container: Container,
  SystemTaskList: TaskList,
  UserMenuAvatar: UserAvatarMenu,
};

export default legacyUIComponents;
