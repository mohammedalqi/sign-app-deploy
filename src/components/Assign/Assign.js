import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import {
  Box,
  Button,
  Container,
  Heading,
  TextField,
  Table,
  Text,
  Toast,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { addSignee, selectAssignees } from './AssignSlice';
import '../Profile/Profile.css'

const Assign = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const assignees = useSelector(selectAssignees);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const prepare = () => {
    if (assignees.length > 0) {
      navigate(`/menyiapkan-dokumen`);
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1000);
    }
  };

  const addUser = (name, email) => {
    let error = null;
    setError(null);
  
    const key = `${new Date().getTime()}${email}`;
  
  // Validasi Nama Lengkap tidak boleh kosong
  if (!name) {
    error = 'Nama lengkap tidak boleh kosong';
  } else if (/[0-9~`!@#$%^&*()+=\-[\]\\';,/{}|\\":<>?._]/.test(name)) {
    error = 'Nama tidak boleh mengandung simbol atau angka';
  } else if (!email) {
    // Validasi email tidak boleh kosong
    error = 'Email tidak boleh kosong';
  } else if (!email.includes('@') || !email.includes('.')) {
    // Validasi email tidak valid
    error = 'Email tidak valid';
  }

  if (error) {
    setError(error);
    setTimeout(() => setError(null), 3000);
    return;
  }
  
    // Tambahkan user hanya jika tidak ada kesalahan
    dispatch(addSignee({ key, name, email }));
    setEmail('');
    setDisplayName('');
};

  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            <Heading size="md">Pihak Penandatangan</Heading>
          </Box>
          <Box padding={2}>
            <TextField
              id="displayName"
              onChange={event => setDisplayName(event.value)}
              placeholder="Masukkan nama penerima"
              label="Nama"
              value={displayName}
              type="text"
            />
          </Box>
          <Box padding={2}>
            <TextField
              id="email"
              onChange={event => setEmail(event.value)}
              placeholder="Masukkan email penerima"
              label="Email"
              value={email}
              type="email"
            />
          {
            error && (
                <div className="text-danger" style={{color:'red', fontSize:'12px'}}>
                    <p>{error}</p>
                </div>
                )
            }
          </Box>
          <Box padding={2}>
            <Button
              onClick={event => {
                addUser(displayName, email);
              }}
              text="Tambahkan Penerima"
              color="blue"
              inline
            />
          </Box>
          <Box padding={2}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Text weight="bold">Nama</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Email</Text>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {assignees.map(user => (
                  <Table.Row key={user.key}>
                    <Table.Cell>
                      <Text>{user.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{user.email}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Box>
          <Box padding={2}>
            <Button onClick={prepare} text="Lanjutkan" color="blue" inline />
          </Box>
          <Box
            fit
            dangerouslySetInlineStyle={{
              __style: {
                bottom: 50,
                left: '50%',
                transform: 'translateX(-50%)',
              },
            }}
            paddingX={1}
            position="fixed"
          >
            {showToast && (
              <Toast color="red" text={<>Tolong tambahkan setidaknya satu penerima!</>} />
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Assign;
