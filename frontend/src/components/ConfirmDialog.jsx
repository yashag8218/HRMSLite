import { HiExclamation, HiTrash, HiQuestionMarkCircle } from 'react-icons/hi';
import Modal from './Modal';
import Button from './Button';

const icons = {
  danger: HiTrash,
  warning: HiExclamation,
  info: HiQuestionMarkCircle,
};

const iconColors = {
  danger: 'from-rose-500 to-red-500',
  warning: 'from-amber-500 to-orange-500',
  info: 'from-blue-500 to-indigo-500',
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const Icon = icons[variant] || icons.info;
  const gradient = iconColors[variant] || iconColors.info;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex items-center justify-center">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            className="min-w-[100px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
