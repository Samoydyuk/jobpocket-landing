import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { DatePicker } from '../ui/DatePicker';
import { clientsApi, jobsApi } from '../../api/endpoints';
import { useToast } from '../../hooks/useToast';
import type { CreateJobInput } from '../../api/types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface LineItemDraft {
  description: string;
  quantity: number;
  unitPrice: number;
}

export function JobCreateModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [clientId, setClientId] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([
    { description: '', quantity: 1, unitPrice: 0 },
  ]);

  const { data: clientsData } = useQuery({
    queryKey: ['clients', 'all'],
    queryFn: async () => (await clientsApi.list({})).clients,
    enabled: open,
  });

  const createMut = useMutation({
    mutationFn: (data: CreateJobInput) => jobsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created');
      onClose();
      resetForm();
    },
    onError: () => toast.error('Failed to create job'),
  });

  function resetForm() {
    setClientId('');
    setType('');
    setAddress('');
    setScheduledAt('');
    setNotes('');
    setTaxRate(0);
    setLineItems([{ description: '', quantity: 1, unitPrice: 0 }]);
  }

  function addLineItem() {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(index: number, field: keyof LineItemDraft, value: string | number) {
    setLineItems(lineItems.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  function handleSubmit() {
    const items = lineItems
      .filter(li => li.description.trim())
      .map(li => ({
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.quantity * li.unitPrice,
      }));

    createMut.mutate({
      clientId: clientId || undefined,
      type: type || undefined,
      address: address || undefined,
      scheduledAt: scheduledAt || undefined,
      notes: notes || undefined,
      taxRate,
      lineItems: items,
    });
  }

  const subtotal = lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Job"
      width={600}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} size="sm">Cancel</Button>
          <Button onClick={handleSubmit} loading={createMut.isPending} size="sm">Create Job</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Select
          label="Client"
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            const client = clientsData?.find(c => c.id === e.target.value);
            if (client?.address && !address) setAddress(client.address);
          }}
          placeholder="Select client..."
          options={(clientsData || []).map(c => ({ value: c.id, label: c.name }))}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Job Type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Repair, Install" />
          <DatePicker label="Schedule" value={scheduledAt} onChange={setScheduledAt} />
        </div>

        <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Job address" />

        {/* Line Items */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Line Items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lineItems.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 32px', gap: 8, alignItems: 'end' }}>
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(i, 'description', e.target.value)}
                />
                <Input
                  placeholder="Qty"
                  type="number"
                  value={String(item.quantity)}
                  onChange={(e) => updateLineItem(i, 'quantity', Number(e.target.value))}
                  style={{ textAlign: 'center' }}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={String(item.unitPrice)}
                  onChange={(e) => updateLineItem(i, 'unitPrice', Number(e.target.value))}
                  style={{ textAlign: 'right' }}
                />
                <button
                  onClick={() => removeLineItem(i)}
                  style={{ padding: 6, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addLineItem}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 0', fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, marginTop: 4 }}
          >
            <Plus size={14} /> Add item
          </button>
        </div>

        {/* Tax + Totals */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            label="Tax Rate %"
            type="number"
            value={String(taxRate)}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            style={{ width: 100, textAlign: 'right' }}
          />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Subtotal: ${subtotal.toFixed(2)}
            </div>
            {tax > 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                Tax: ${tax.toFixed(2)}
              </div>
            )}
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              Total: ${total.toFixed(2)}
            </div>
          </div>
        </div>

        <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes..." />
      </div>
    </Modal>
  );
}
