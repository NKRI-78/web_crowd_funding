import clsx from "clsx";
import { InboxResponse } from "./inbox-interface";

interface Props {
  inbox?: InboxResponse | null;
  onApprove: (isUpdateDocument?: boolean, administrationFee?: string) => void;
  onReject: (isUpdateDocument?: boolean) => void;
  barrierAction?: () => void;
}

function formatRupiah(value: number | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const InboxModalDialog: React.FC<Props> = ({
  inbox,
  onApprove,
  barrierAction,
  onReject,
}) => {
  // isUpdateDocument ketika field_3 berisi reupload-document
  const isUpdateDocument = inbox?.field_3 === "reupload-document";

  const paymentDetailStr = inbox?.data ?? "{}";
  const paymentDetail = JSON.parse(paymentDetailStr);

  // administration detail fee
  const totalPayment = paymentDetail.total_amount;
  const administrationFee = formatRupiah(Number(totalPayment));
  const registrationFee = formatRupiah(
    Number(paymentDetail.info[0].calculated_amount)
  );
  const depositNotaris = formatRupiah(
    Number(paymentDetail.info[1].calculated_amount)
  );
  const platformFee = formatRupiah(
    Number(paymentDetail.info[2].calculated_amount)
  );

  return (
    <Dialog open onOpenChange={barrierAction}>
      <DialogContent>
        {/* header */}
        <DialogHeader>
          <h2 className="text-lg font-semibold text-black">{inbox?.title}</h2>
        </DialogHeader>

        {/* content */}
        {isUpdateDocument ? (
          <div className="space-y-2 text-black">{inbox.content}</div>
        ) : (
          <div className="w-full text-black space-y-2">
            <div className="w-full flex">
              <p className="text-gray-500 flex-[1]">Registration Fee</p>
              <p className="font-medium flex-[1]">{registrationFee}</p>
            </div>

            <div className="w-full flex">
              <p className="text-gray-500 flex-[1]">Deposit Notaris</p>
              <p className="font-medium flex-[1]">{depositNotaris}</p>
            </div>
            <div className="w-full flex">
              <p className="text-gray-500 flex-[1]">Platform Fee</p>
              <p className="font-medium flex-[1]">{platformFee}</p>
            </div>
            <p>{`Total pembayaran sebesar ${administrationFee}`}</p>
          </div>
        )}

        {/* footer */}
        <DialogFooter>
          <Button
            variant="rejected"
            onClick={() => {
              onReject(isUpdateDocument);
            }}
          >
            {isUpdateDocument ? "Batal" : "Tidak Setuju"}
          </Button>
          <Button
            onClick={() => {
              onApprove(isUpdateDocument, totalPayment);
            }}
          >
            {isUpdateDocument ? "Update" : "Setuju"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Dialog: React.FC<{
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className="bg-white w-full max-w-md rounded-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="p-6">{children}</div>;
};

const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mb-4 border-b pb-2">{children}</div>;
};

const DialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accepted" | "rejected";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "accepted",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none";

  const variants = {
    accepted: "bg-green-600 text-white hover:bg-green-700",
    rejected: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={clsx(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default InboxModalDialog;
