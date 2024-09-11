import {
  MutationStatus,
  UseMutateFunction,
  useMutation,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { useToast } from "../../components/ui/use-toast";
import httpCommon from "../helper/httpCommon";
import Message from "../../components/toasts";

export type TBulkImportTarget = "PROVIDER" | "CENTER";

type TBulkImportContextType = {
  centers_bulk_import_status: MutationStatus | undefined;
  import_centers:
    | UseMutateFunction<AxiosResponse<any, any>, Error, { file: File }, unknown>
    | undefined;
  providers_bulk_import_status: MutationStatus | undefined;
  import_providers:
    | UseMutateFunction<AxiosResponse<any, any>, Error, { file: File }, unknown>
    | undefined;
};

const bulkImportContext = React.createContext<TBulkImportContextType | null>(
  null
);

export function useBulkImport(): TBulkImportContextType {
  const ctx = useContext(bulkImportContext);
  return {
    import_centers: ctx?.import_centers,
    import_providers: ctx?.import_providers,
    centers_bulk_import_status: ctx?.centers_bulk_import_status,
    providers_bulk_import_status: ctx?.providers_bulk_import_status,
  };
}

export default function BulkImportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();

  const { status: centers_bulk_import_status, mutate: import_centers } =
    useMutation({
      mutationKey: ["bulk-import"],
      mutationFn: async ({ file }: { file: File }) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        return await httpCommon.post(
          `medical-centers/import-csv-data`,
          formData
        );
      },
      onSuccess(data) {
        if (data?.data.success) {
          toast({
            description: (
              <Message message={data?.data.data.message} type="success" />
            ),
          });
        }
      },
    });

  const { status: providers_bulk_import_status, mutate: import_providers } =
    useMutation({
      mutationKey: ["bulk-import"],
      mutationFn: async ({ file }: { file: File }) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        return await httpCommon.post(`providers/import-csv-data`, formData);
      },
      onSuccess(data) {
        if (data?.data.success) {
          toast({
            description: (
              <Message message={data?.data.data.message} type="success" />
            ),
          });
        }
      },
    });

  return (
    <bulkImportContext.Provider
      value={{
        centers_bulk_import_status,
        import_centers,
        import_providers,
        providers_bulk_import_status,
      }}
    >
      {children}
    </bulkImportContext.Provider>
  );
}
