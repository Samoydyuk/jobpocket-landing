import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { clientsApi } from '../../api/endpoints';
import { useToast } from '../../hooks/useToast';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ClientCreateModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const createMut = useMutation({
    mutationFn: () => clientsApi.create({ name, email: email || undefined, phone: phone || undefined, address: address || undefined, notes: notes || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created');
      onClose();
      setName(''); setEmail(''); setPhone(''); setAddress(''); setNotes('');
    },
    onError: () => toast.error('Failed to create client'),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Client"
      width={480}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} size="sm">Cancel</Button>
          <Button onClick={() => createMut.mutate()} loading={createMut.isPending} disabled={!name.trim()} size="sm">
            Create Client
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
        </div>
        <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Client address" />
        <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes about this client..." />
      </div>
    </Modal>
  );
}
