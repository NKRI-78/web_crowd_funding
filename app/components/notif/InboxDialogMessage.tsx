import { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { API_BACKEND } from "@/app/utils/constant";
import { InboxModel } from "./InboxModel";

interface InboxDialogMessageProps {
  inboxId: number;
  userToken: string;
  onAccept: (isUpdateDocument?: boolean) => void;
  barrierAction?: () => void;
  onReject: (projectId: string, isUpdateDocument?: boolean) => void;
}

const InboxDialogMessage: React.FC<InboxDialogMessageProps> = ({
  inboxId,
  userToken,
  onAccept,
  barrierAction,
  onReject,
}) => {
  const [data, setData] = useState<InboxModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // is update document
  const isUpdateDocument = data?.field_3 === "reupload-document";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `${API_BACKEND}/api/v1/inbox/detail/${inboxId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setData(res.data["data"]);
      } catch (err) {
        setError("Gagal memuat detail inbox.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [inboxId]);

  function formatRupiah(input: string): string {
    try {
      const number = parseFloat(input.replace(/[^0-9.-]+/g, ""));

      if (isNaN(number)) {
        throw new Error("Input bukan angka yang valid");
      }

      return `Rp ${number.toLocaleString("id-ID")}`;
    } catch (error) {
      console.error("formatRupiah error:", error);
      return "Rp 0";
    }
  }

  return (
    <Dialog open onOpenChange={barrierAction}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg font-semibold text-black">
            {data?.title ?? "Memuat..."}
          </h2>
        </DialogHeader>

        {loading ? (
          <p>Memuat...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data ? (
          <div className="space-y-2 text-black">
            {isUpdateDocument ? (
              <p>{data.content}</p>
            ) : (
              <p>
                {data.content}{" "}
                {data?.field_1.length === 0 ? "-" : formatRupiah(data.field_1)}
              </p>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="rejected"
            onClick={() => {
              onReject(data?.field_2 ?? "", isUpdateDocument);
            }}
          >
            {isUpdateDocument ? "Batal" : "Tidak Setuju"}
          </Button>
          <Button
            onClick={() => {
              onAccept(isUpdateDocument);
            }}
            disabled={!data}
          >
            {isUpdateDocument ? "Update" : "Setuju"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
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

export default InboxDialogMessage;
